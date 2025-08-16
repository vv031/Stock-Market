from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, StockData, Company
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random
import math

router = APIRouter()

class StockDataResponse(BaseModel):
    date: str
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int

    class Config:
        from_attributes = True

class StockInfoResponse(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    volume: int
    market_cap: float
    pe_ratio: float
    dividend_yield: float
    week_52_high: float
    week_52_low: float

    class Config:
        from_attributes = True

def generate_mock_stock_data(symbol: str, days: int = 30) -> List[StockData]:
    """Generate realistic mock stock data"""
    data = []
    base_price = random.uniform(100, 2000)  # Random base price
    current_price = base_price
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i-1)
        
        # Generate realistic price movements
        daily_change = random.uniform(-0.05, 0.05)  # ±5% daily change
        current_price *= (1 + daily_change)
        
        # Generate OHLC data
        open_price = current_price
        high_price = open_price * random.uniform(1.0, 1.03)
        low_price = open_price * random.uniform(0.97, 1.0)
        close_price = current_price
        
        # Generate volume
        volume = random.randint(100000, 5000000)
        
        stock_data = StockData(
            company_symbol=symbol,
            date=date,
            open_price=round(open_price, 2),
            high_price=round(high_price, 2),
            low_price=round(low_price, 2),
            close_price=round(close_price, 2),
            volume=volume
        )
        data.append(stock_data)
    
    return data

@router.get("/{symbol}/historical", response_model=List[StockDataResponse])
async def get_stock_historical_data(
    symbol: str, 
    days: int = 30, 
    db: Session = Depends(get_db)
):
    """Get historical stock data for a company"""
    # Check if company exists
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get existing data
    existing_data = db.query(StockData).filter(
        StockData.company_symbol == symbol
    ).order_by(StockData.date.desc()).limit(days).all()
    
    if not existing_data:
        # Generate mock data if none exists
        mock_data = generate_mock_stock_data(symbol, days)
        for data in mock_data:
            db.add(data)
        db.commit()
        existing_data = mock_data
    
    # Convert to response format
    response_data = []
    for data in existing_data:
        response_data.append({
            "date": data.date.strftime("%Y-%m-%d"),
            "open_price": data.open_price,
            "high_price": data.high_price,
            "low_price": data.low_price,
            "close_price": data.close_price,
            "volume": data.volume
        })
    
    return response_data

@router.get("/{symbol}/info", response_model=StockInfoResponse)
async def get_stock_info(symbol: str, db: Session = Depends(get_db)):
    """Get current stock information"""
    # Check if company exists
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get latest stock data
    latest_data = db.query(StockData).filter(
        StockData.company_symbol == symbol
    ).order_by(StockData.date.desc()).first()
    
    if not latest_data:
        # Generate mock data if none exists
        mock_data = generate_mock_stock_data(symbol, 1)
        db.add(mock_data[0])
        db.commit()
        latest_data = mock_data[0]
    
    # Get previous day data for change calculation
    prev_data = db.query(StockData).filter(
        StockData.company_symbol == symbol,
        StockData.date < latest_data.date
    ).order_by(StockData.date.desc()).first()
    
    if prev_data:
        change = latest_data.close_price - prev_data.close_price
        change_percent = (change / prev_data.close_price) * 100
    else:
        change = 0
        change_percent = 0
    
    # Get 52-week high/low
    year_data = db.query(StockData).filter(
        StockData.company_symbol == symbol,
        StockData.date >= datetime.now() - timedelta(days=365)
    ).all()
    
    if year_data:
        week_52_high = max([d.high_price for d in year_data])
        week_52_low = min([d.low_price for d in year_data])
    else:
        week_52_high = latest_data.high_price
        week_52_low = latest_data.low_price
    
    return StockInfoResponse(
        symbol=symbol,
        current_price=latest_data.close_price,
        change=round(change, 2),
        change_percent=round(change_percent, 2),
        volume=latest_data.volume,
        market_cap=company.market_cap,
        pe_ratio=company.pe_ratio,
        dividend_yield=company.dividend_yield,
        week_52_high=round(week_52_high, 2),
        week_52_low=round(week_52_low, 2)
    )
