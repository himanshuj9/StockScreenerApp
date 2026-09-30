from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.market_data import get_current_price

from app.database import get_db
from app.models.company import Company
from app.models.ratio import Ratio
from app.models.company_information import CompanyInformation
from app.models.financial_result import FinancialResult
from app.models.metric import Metric
from app.models.shareholding import ShareholdingPattern
from app.models.balance_sheet import BalanceSheet


router = APIRouter(
    prefix="/api/company",
    tags=["Company"]
)

@router.get("/search")
def search_companies(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    search_term = f"%{q.strip()}%"

    companies = (
        db.query(Company)
        .filter(
            (Company.company_name.ilike(search_term)) |
            (Company.symbol.ilike(search_term))
        )
        .limit(10)
        .all()
    )

    return [
        {
            "company_name": company.company_name,
            "symbol": company.symbol
        }
        for company in companies
    ]

@router.get("/{symbol}")
def get_company(symbol: str, db: Session = Depends(get_db)):
    

    #Get company
    company = (
        db.query(Company)
        .filter(Company.symbol == symbol.upper())
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    yahoo_symbol = f"{company.symbol}.NS"
    current_price = get_current_price(yahoo_symbol)

    # Get ratios
    ratios = (
        db.query(Ratio)
        .filter(Ratio.company_id == company.company_id)
        .all()
    )

    #Get company information
    information = (
        db.query(CompanyInformation)
        .filter(
            CompanyInformation.company_id == company.company_id
        )
        .first()
    )

    # Get financial results
    financial_results = (
        db.query(
            FinancialResult,
            Metric.metric_name
        )
        .join(
            Metric,
            FinancialResult.metric_id == Metric.metric_id
        )
        .filter(
            FinancialResult.company_id == company.company_id
        )
        .all()
    )

    #Get shareholding data
    shareholding = (
        db.query(ShareholdingPattern)
        .filter(
            ShareholdingPattern.company_id == company.company_id
        )
        .order_by(
            ShareholdingPattern.year,
            ShareholdingPattern.quarter
        )
        .all()
    )

    #Get balance sheet
    balance_sheet = (
        db.query(BalanceSheet)
        .filter(BalanceSheet.company_id == company.company_id)
        .order_by(BalanceSheet.year)
        .all()
    )

    # Convert balance sheet data
    balance_sheet_data = []

    for data in balance_sheet:
        balance_sheet_data.append({
            "year": data.year,
            "equity_capital": float(data.equity_capital),
            "reserves": float(data.reserves),
            "borrowings": float(data.borrowings),
            "other_liabilities": float(data.other_liabilities),
            "total_liabilities": float(data.total_liabilities),
            "fixed_assets": float(data.fixed_assets),
            "cwip": float(data.cwip),
            "investments": float(data.investments),
            "other_assets": float(data.other_assets),
            "total_assets": float(data.total_assets)
        })  

    #Convert ratios into a dictionary
    ratio_data = {}

    for ratio in ratios:
        ratio_data[ratio.ratio_name] = float(ratio.value)

    #Convert financial results into JSON-friendly format
    financial_data = {}

    for result, metric_name in financial_results:
        key = (result.year, result.quarter)

        if key not in financial_data:
            financial_data[key] = {
                "year": result.year,
                "quarter": result.quarter
            }

        financial_data[key][metric_name] = float(result.value)

    financial_data = list(financial_data.values())

    #Convert shareholding data
    shareholding_data = []

    for data in shareholding:
        shareholding_data.append({
            "year": data.year,
            "quarter": data.quarter,
            "promoter": float(data.promoter_shareholding),
            "fii": float(data.fii_shareholding),
            "dii": float(data.dii_shareholding),
            "public": float(data.public_shareholding),
            "others": float(data.others_shareholding),
            "shareholders_count": data.shareholders_count
        })

    #Return everything
    return {
        "company": {
            "company_id": company.company_id,
            "company_name": company.company_name,
            "symbol": company.symbol
        },
         "market_data": {
        "current_price": current_price
    },
        "ratios": ratio_data,

        "information": {
            "about": information.about if information else None,
            "key_points": information.key_points if information else None
        },

        "financials": financial_data,

        "shareholding": shareholding_data,

        "balance_sheet": balance_sheet_data
    }