from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Company
from pydantic import BaseModel
from typing import List
import random

router = APIRouter()

class CompanyResponse(BaseModel):
    id: int
    symbol: str
    name: str
    sector: str
    market_cap: float
    pe_ratio: float
    dividend_yield: float

    class Config:
        from_attributes = True

# Mock company data (NSE format)
MOCK_COMPANIES = [
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "sector": "Oil & Gas", "market_cap": 1500000.0, "pe_ratio": 25.5, "dividend_yield": 0.8},
    {"symbol": "TCS", "name": "Tata Consultancy Services Ltd", "sector": "IT", "market_cap": 1200000.0, "pe_ratio": 30.2, "dividend_yield": 1.2},
    {"symbol": "HDFC", "name": "HDFC Bank Ltd", "sector": "Banking", "market_cap": 800000.0, "pe_ratio": 18.7, "dividend_yield": 1.5},
    {"symbol": "INFY", "name": "Infosys Ltd", "sector": "IT", "market_cap": 700000.0, "pe_ratio": 28.9, "dividend_yield": 1.0},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "sector": "Banking", "market_cap": 600000.0, "pe_ratio": 16.3, "dividend_yield": 1.8},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd", "sector": "FMCG", "market_cap": 500000.0, "pe_ratio": 45.2, "dividend_yield": 2.1},
    {"symbol": "ITC", "name": "ITC Ltd", "sector": "FMCG", "market_cap": 450000.0, "pe_ratio": 22.8, "dividend_yield": 3.2},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "market_cap": 400000.0, "pe_ratio": 12.5, "dividend_yield": 2.5},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd", "sector": "Telecom", "market_cap": 350000.0, "pe_ratio": 35.6, "dividend_yield": 0.5},
    {"symbol": "AXISBANK", "name": "Axis Bank Ltd", "sector": "Banking", "market_cap": 300000.0, "pe_ratio": 15.8, "dividend_yield": 1.9},
    {"symbol": "WIPRO", "name": "Wipro Ltd", "sector": "IT", "market_cap": 250000.0, "pe_ratio": 26.4, "dividend_yield": 0.9},
    {"symbol": "HCLTECH", "name": "HCL Technologies Ltd", "sector": "IT", "market_cap": 200000.0, "pe_ratio": 24.1, "dividend_yield": 1.1}
]

@router.get("/", response_model=List[CompanyResponse])
async def get_companies(db: Session = Depends(get_db)):
    """Get all companies"""
    companies = db.query(Company).all()
    if not companies:
        # Seed mock data if no companies exist
        await seed_companies(db)
        companies = db.query(Company).all()
    return companies

@router.get("/{symbol}", response_model=CompanyResponse)
async def get_company(symbol: str, db: Session = Depends(get_db)):
    """Get company by symbol"""
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

async def seed_companies(db: Session):
    """Seed database with mock company data"""
    for company_data in MOCK_COMPANIES:
        company = Company(**company_data)
        db.add(company)
    db.commit()
