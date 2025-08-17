from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from . import Base


class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)


class BillingInfo(Base):
    __tablename__ = "billing_info"

    id = Column(Integer, primary_key=True)
    customer_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
