from sqlalchemy import Column, Integer, Numeric, ForeignKey
from app.database import Base


class ShareholdingPattern(Base):
    __tablename__ = "shareholding_pattern"

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id"),
        primary_key=True
    )

    year = Column(Integer, primary_key=True)
    quarter = Column(Integer, primary_key=True)

    promoter_shareholding = Column(Numeric(5, 2))
    fii_shareholding = Column(Numeric(5, 2))
    dii_shareholding = Column(Numeric(5, 2))
    public_shareholding = Column(Numeric(5, 2))
    others_shareholding = Column(Numeric(5, 2))
    shareholders_count = Column(Integer)