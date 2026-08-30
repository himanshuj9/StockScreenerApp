from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from app.database import Base


class Ratio(Base):
    __tablename__ = "ratios"

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id"),
        primary_key=True
    )

    ratio_name = Column(String(50), primary_key=True)
    year = Column(Integer, primary_key=True)
    value = Column(Numeric(15, 2))