from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database import Base


class CompanyInformation(Base):
    __tablename__ = "company_information"

    company_id = Column(
        Integer,
        ForeignKey("companies.company_id"),
        primary_key=True
    )

    about = Column(Text)
    key_points = Column(Text)