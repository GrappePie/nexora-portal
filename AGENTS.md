> Diseño de **agentes/servicios de fondo** para tareas automáticas y tolerantes a fallos en un entorno local‑first con conectividad intermitente.

## Objetivos
- Ejecutar trabajos **asíncronos** fuera del request/response.
- Seguros, **idempotentes** y **reanudables** al volver el Internet.
- Operables: monitoreo simple, reintentos y runbooks.

## Arquitectura de agentes
- **Cola**: Redis (ya en `docker-compose.yml`).
- **Worker**: `rq` (ligero) + `APScheduler` para programar tareas periódicas.
- **Patrones**: outbox (pendientes), backoff exponencial, *dead‑letter*.

### Servicios (compose)
Agrega este servicio al `docker-compose.yml`:
```yaml
worker:
  build: ./backend
  command: python -m app.agents.worker
  environment:
    REDIS_URL: ${REDIS_URL}
    DATABASE_URL: postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    S3_ENDPOINT: http://minio:9000
    S3_BUCKET: ${S3_BUCKET}
    S3_ACCESS_KEY: ${S3_ACCESS_KEY}
    S3_SECRET_KEY: ${S3_SECRET_KEY}
    PAC_PROVIDER: ${PAC_PROVIDER}
    PAC_USER: ${PAC_USER}
    PAC_PASS: ${PAC_PASS}
    LICENSE_PUBLIC_KEY_HEX: ${LICENSE_PUBLIC_KEY_HEX}
    LICENSE_GRACE_DAYS: ${LICENSE_GRACE_DAYS}
    AGENTS_ENABLED: ${AGENTS_ENABLED:-true}
  depends_on: [redis, db, minio]
  restart: unless-stopped
```

## Agentes incluidos (MVP)
1) **License Agent**
    - **Función**: validar/renovar licencia, aplicar *limited mode*, descargar CRL.
    - **Disparos**: al arranque y cada **60 min**; manual `POST /api/admin/agents/sync-license`.
    - **Offline**: permite operar hasta `grace_days`; en cola la renovación.

2) **Backup Agent**
    - **Función**: `pg_dump` comprimido (retiene 14 días por defecto).
    - **Horario**: diario **03:05** (hora local). Manual `POST /api/admin/agents/backup-now`.
    - **Destino**: carpeta local `backups/`; opcional copiar a S3/MinIO.

3) **CFDI (Sandbox) Agent**
    - **Función**: tomar **comprobantes** en estado `pending` y timbrarlos en sandbox.
    - **Frecuencia**: cada **2 min**. Reintentos **1m, 2m, 4m, 8m… max 6h**.
    - **Salida**: guarda XML (MinIO) + genera PDF.

4) **Media Agent** (evidencias)
    - **Función**: crear **thumbnails**/optimizar imágenes y limpiar presigns vencidos.
    - **Frecuencia**: cada **15 min** (pendientes) + **03:30** limpieza.

5) **Notification Agent** (email/WhatsApp link)
    - **Función**: encolar notificaciones (cotización lista, factura lista, etc.).
    - **Transportes**: SMTP (si configurado) y **WhatsApp por enlace** (gratuito) — sin API comercial al MVP.

6) **Sync Agent** (reconexión)
    - **Función**: al detectar Internet, vaciar **outbox**: renovar licencias, timbrados, notificaciones.
    - **Detección**: *heartbeat* a `https://app.nexora.grappepie.com/ping` con backoff.

> Futuro: **Search Index Agent** (full‑text), **Telemetry Agent** (opt‑in, anónima), **PAC producción**.

## Directorio y módulos
```
backend/app/agents/
├─ __init__.py
├─ jobs.py          # funciones de trabajo (idempotentes)
├─ schedules.py     # definición de cron/intervalos APScheduler
├─ worker.py        # arranque RQ worker + scheduler
└─ utils.py         # backoff, locks, helpers S3/DB
```

### `worker.py` (bootstrap)
```py
from rq import Worker, Queue, Connection
from redis import Redis
from apscheduler.schedulers.background import BackgroundScheduler
from .schedules import register_schedules
import os

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
conn = Redis.from_url(redis_url)

if os.getenv("AGENTS_ENABLED", "true").lower() != "true":
    print("[agents] disabled via env")
else:
    scheduler = BackgroundScheduler(timezone="local")
    register_schedules(scheduler)
    scheduler.start()

    with Connection(conn):
        w = Worker([Queue("default"), Queue("high"), Queue("low")])
        w.work(with_scheduler=True)
```

### `schedules.py`
```py
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from . import jobs

def register_schedules(sched):
    sched.add_job(jobs.license_sync, IntervalTrigger(minutes=60), id="license_sync", replace_existing=True)
    sched.add_job(jobs.backup_db, CronTrigger(hour=3, minute=5), id="backup_db", replace_existing=True)
    sched.add_job(jobs.cfdi_sandbox_drain, IntervalTrigger(minutes=2), id="cfdi_drain", replace_existing=True)
    sched.add_job(jobs.media_process_pending, IntervalTrigger(minutes=15), id="media_proc", replace_existing=True)
    sched.add_job(jobs.cleanup_presigns, CronTrigger(hour=3, minute=30), id="cleanup_presigns", replace_existing=True)
    sched.add_job(jobs.sync_outbox, IntervalTrigger(minutes=5), id="sync_outbox", replace_existing=True)
```

### `jobs.py` (esqueleto)
```py
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import /* tus modelos */
import time, os, json

# Helpers
class JobError(Exception):
    pass

def with_session(fn):
    def wrapper(*args, **kwargs):
        db: Session = SessionLocal()
        try:
            return fn(db, *args, **kwargs)
        finally:
            db.close()
    return wrapper

@with_session
def license_sync(db: Session):
    # 1) Leer licencia local; 2) si online, pedir renovación/CRL al portal; 3) aplicar limited_mode
    pass

@with_session
def backup_db(db: Session):
    # ejecutar pg_dump (subproceso) y rotación 14 días
    pass

@with_session
def cfdi_sandbox_drain(db: Session):
    # tomar comprobantes pending, POST sandbox si hay Internet, guardar XML/PDF, actualizar estado
    pass

@with_session
def media_process_pending(db: Session):
    # crear thumbnails, optimizar jpg/png
    pass

@with_session
def cleanup_presigns(db: Session):
    # limpiar URLs presignadas expiradas (metadatos)
    pass

@with_session
def sync_outbox(db: Session):
    # si hay conectividad, empujar pendientes (licencias, notifs, facturas)
    pass
```

## Endpoints de administración (opcionales)
> Restringidos por LAN + rol admin (cuando haya auth real).

- `GET  /api/admin/agents/health` → estados de scheduler/colas.
- `GET  /api/admin/agents/queues` → tamaños de `default/high/low`.
- `POST /api/admin/agents/sync-license` → encola `license_sync` inmediato.
- `POST /api/admin/agents/backup-now` → ejecuta `backup_db` ahora.
- `POST /api/admin/agents/retry/:kind/:id` → reintento dirigido (cfdi, media, notif).

## Variables de entorno
| Variable | Default | Descripción |
|---|---:|---|
| `AGENTS_ENABLED` | `true` | Desactiva todos los agentes si `false`. |
| `BACKUP_RETENTION_DAYS` | `14` | Días a retener .sql.gz. |
| `CFDI_RETRY_MAX_HOURS` | `6` | Límite de backoff para timbrado. |
| `AGENTS_HEARTBEAT_URL` | *(vacío)* | URL para comprobar conectividad. |

## Seguridad y privacidad
- Los agentes **no exponen** puertos adicionales.
- Los endpoints admin deben vivir **solo en LAN** y requerir auth cuando esté lista.
- No registrar PII sensible en logs. Enmascarar tokens/credenciales.

## Operación y monitoreo
- Logs a `stdout` (Docker): `docker compose logs -f worker`.
- Health básico: `GET /api/admin/agents/health` (+ `/api/health`).
- Ante fallos repetidos, mover a **dead‑letter** y alertar por email (si SMTP).

## Runbooks
- **Reintentar timbrado**: `POST /api/admin/agents/retry/cfdi/<id>`.
- **Forzar respaldo**: `POST /api/admin/agents/backup-now` y verificar archivo en `backups/`.
- **Deshabilitar temporalmente**: `AGENTS_ENABLED=false` → `docker compose up -d`.

## Pruebas recomendadas
- **Offline**: cortar Internet y crear/autorizar; verificar que colas crezcan y se drenen al reconectar.
- **Carga**: subir 50 fotos (4–8 MB) y comprobar miniaturas/tiempos.
- **Resiliencia**: matar contenedor `worker` durante timbrado y asegurar idempotencia.
