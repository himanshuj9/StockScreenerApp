from sqlalchemy import Column, Integer, String
from app.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    metric_id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(50), nullable=False, unique=True)