from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Prediction, StockData, Company
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
import random

router = APIRouter()

class PredictionResponse(BaseModel):
    symbol: str
    predicted_price: float
    confidence: float
    prediction_date: str
    current_price: float
    price_direction: str

    class Config:
        from_attributes = True

def generate_mock_prediction(current_price: float) -> tuple:
    """Generate a mock prediction using simple heuristics"""
    # Simple price movement prediction based on random walk
    price_change_percent = random.uniform(-0.08, 0.08)  # ±8% daily change
    predicted_price = current_price * (1 + price_change_percent)
    
    # Generate confidence based on price volatility
    confidence = random.uniform(0.65, 0.92)
    
    return predicted_price, confidence

@router.get("/{symbol}/predict", response_model=PredictionResponse)
async def get_stock_prediction(symbol: str, db: Session = Depends(get_db)):
    """Get AI prediction for next day stock price"""
    # Check if company exists
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get latest stock data
    stock_data = db.query(StockData).filter(
        StockData.company_symbol == symbol
    ).order_by(StockData.date.desc()).limit(1).first()
    
    if not stock_data:
        raise HTTPException(status_code=400, detail="No stock data available for prediction")
    
    current_price = stock_data.close_price
    
    # Generate mock prediction
    predicted_price, confidence = generate_mock_prediction(current_price)
    
    price_direction = "UP" if predicted_price > current_price else "DOWN"
    
    # Save prediction to database
    prediction = Prediction(
        company_symbol=symbol,
        predicted_price=round(predicted_price, 2),
        confidence=round(confidence, 3),
        prediction_date=datetime.now() + timedelta(days=1)
    )
    db.add(prediction)
    db.commit()
    
    return PredictionResponse(
        symbol=symbol,
        predicted_price=round(predicted_price, 2),
        confidence=round(confidence, 3),
        prediction_date=(datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        current_price=current_price,
        price_direction=price_direction
    )

@router.get("/{symbol}/history", response_model=List[PredictionResponse])
async def get_prediction_history(symbol: str, db: Session = Depends(get_db)):
    """Get prediction history for a company"""
    predictions = db.query(Prediction).filter(
        Prediction.company_symbol == symbol
    ).order_by(Prediction.created_at.desc()).limit(10).all()
    
    response_data = []
    for pred in predictions:
        # Get current price for comparison
        current_data = db.query(StockData).filter(
            StockData.company_symbol == symbol
        ).order_by(StockData.date.desc()).first()
        
        current_price = current_data.close_price if current_data else 0
        price_direction = "UP" if pred.predicted_price > current_price else "DOWN"
        
        response_data.append(PredictionResponse(
            symbol=symbol,
            predicted_price=pred.predicted_price,
            confidence=pred.confidence,
            prediction_date=pred.prediction_date.strftime("%Y-%m-%d"),
            current_price=current_price,
            price_direction=price_direction
        ))
    
    return response_data
