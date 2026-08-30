from sqlalchemy import Column, Integer, Numeric, ForeignKey
from app.database import Base


class BalanceSheet(Base):
    __tablename__ = "balance_sheet"

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id"),
        primary_key=True
    )

    year = Column(Integer, primary_key=True)

    equity_capital = Column(Numeric(15, 2))
    reserves = Column(Numeric(15, 2))
    borrowings = Column(Numeric(15, 2))
    other_liabilities = Column(Numeric(15, 2))
    total_liabilities = Column(Numeric(15, 2))

    fixed_assets = Column(Numeric(15, 2))
    cwip = Column(Numeric(15, 2))
    investments = Column(Numeric(15, 2))
    other_assets = Column(Numeric(15, 2))
    total_assets = Column(Numeric(15, 2))