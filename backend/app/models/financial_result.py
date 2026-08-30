from sqlalchemy import Column, Integer, Numeric, ForeignKey
from app.database import Base


class FinancialResult(Base):
    __tablename__ = "financial_results"

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id"),
        primary_key=True
    )

    metric_id = Column(
        Integer,
        ForeignKey("metrics.metric_id"),
        primary_key=True
    )

    year = Column(Integer, primary_key=True)
    quarter = Column(Integer, primary_key=True)

    value = Column(Numeric(15, 2), nullable=False)