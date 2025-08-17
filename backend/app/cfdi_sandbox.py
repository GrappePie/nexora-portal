import base64
import json
import logging
from io import BytesIO
from typing import Any, Dict, Tuple

import requests
from minio import Minio
import redis

logger = logging.getLogger(__name__)


class CfdiSandboxService:
    """Service for generating and sending CFDI 4.0 to sandbox provider."""

    queue_key = "cfdi_retry_queue"

    def __init__(
        self,
        minio_client: Minio,
        redis_client: redis.Redis,
        provider_url: str,
    ) -> None:
        self.minio = minio_client
        self.redis = redis_client
        self.provider_url = provider_url

    def generate_cfdi_json(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Build a minimal CFDI 4.0 JSON representation."""
        return {
            "Version": "4.0",
            "Serie": data.get("serie", "A"),
            "Folio": data.get("folio", "1"),
            "Receptor": {
                "Nombre": data["customer_name"],
                "DomicilioFiscalReceptor": data["address"],
                "UsoCFDI": data.get("uso_cfdi", "G03"),
            },
            "SubTotal": data["total_amount"],
            "Total": data["total_amount"],
        }

    def send_cfdi(self, cfdi_json: Dict[str, Any]) -> Tuple[bytes, bytes]:
        """Send CFDI to sandbox provider and return XML and PDF bytes."""
        response = requests.post(self.provider_url, json=cfdi_json, timeout=10)
        response.raise_for_status()
        body = response.json()
        xml = body["cfdi_xml"].encode("utf-8")
        pdf = base64.b64decode(body["cfdi_pdf"])
        return xml, pdf

    def save_attachments(self, attachment_id: str, xml: bytes, pdf: bytes) -> None:
        """Store resulting XML and PDF in the MinIO 'attachments' bucket."""
        self.minio.put_object(
            "attachments",
            f"{attachment_id}.xml",
            BytesIO(xml),
            len(xml),
            content_type="application/xml",
        )
        self.minio.put_object(
            "attachments",
            f"{attachment_id}.pdf",
            BytesIO(pdf),
            len(pdf),
            content_type="application/pdf",
        )

    def stamp(self, billing_info: Dict[str, Any], attachment_id: str) -> None:
        """Generate, send and store a CFDI; queue for retry on failure."""
        cfdi_json = self.generate_cfdi_json(billing_info)
        try:
            xml, pdf = self.send_cfdi(cfdi_json)
            self.save_attachments(attachment_id, xml, pdf)
        except Exception:
            logger.exception("CFDI stamping failed, enqueueing for retry")
            self.redis.lpush(
                self.queue_key,
                json.dumps({"billing_info": billing_info, "attachment_id": attachment_id}),
            )
            raise

    def process_queue(self) -> None:
        """Attempt to process queued CFDIs until one fails."""
        while True:
            item = self.redis.rpop(self.queue_key)
            if not item:
                break
            payload = json.loads(item)
            try:
                self.stamp(payload["billing_info"], payload["attachment_id"])
            except Exception:
                # Requeue for a later attempt and stop processing
                self.redis.lpush(self.queue_key, item)
                break
