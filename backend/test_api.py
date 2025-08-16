#!/usr/bin/env python3
"""
Simple test script to verify the Stock Market Dashboard API
Run this after starting the backend server
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_companies():
    """Test companies endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/companies/")
        companies = response.json()
        print(f"✅ Companies endpoint: {response.status_code} - {len(companies)} companies")
        
        # Show first company
        if companies:
            first_company = companies[0]
            print(f"   First company: {first_company['symbol']} - {first_company['name']}")
        
        return True
    except Exception as e:
        print(f"❌ Companies endpoint failed: {e}")
        return False

def test_stock_data():
    """Test stock data endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/stocks/RELIANCE/historical?days=7")
        data = response.json()
        print(f"✅ Stock data endpoint: {response.status_code} - {len(data)} days of data")
        
        # Show latest data
        if data:
            latest = data[-1]
            print(f"   Latest data: {latest['date']} - Close: ₹{latest['close_price']}")
        
        return True
    except Exception as e:
        print(f"❌ Stock data endpoint failed: {e}")
        return False

def test_stock_info():
    """Test stock info endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/stocks/RELIANCE/info")
        info = response.json()
        print(f"✅ Stock info endpoint: {response.status_code}")
        print(f"   Current price: ₹{info['current_price']}")
        print(f"   Change: ₹{info['change']} ({info['change_percent']}%)")
        
        return True
    except Exception as e:
        print(f"❌ Stock info endpoint failed: {e}")
        return False

def test_prediction():
    """Test prediction endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/predictions/RELIANCE/predict")
        prediction = response.json()
        print(f"✅ Prediction endpoint: {response.status_code}")
        print(f"   Predicted price: ₹{prediction['predicted_price']}")
        print(f"   Confidence: {prediction['confidence']:.1%}")
        print(f"   Direction: {prediction['price_direction']}")
        
        return True
    except Exception as e:
        print(f"❌ Prediction endpoint failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Stock Market Dashboard API")
    print("=" * 50)
    print(f"Base URL: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    tests = [
        ("Health Check", test_health),
        ("Companies", test_companies),
        ("Stock Data", test_stock_data),
        ("Stock Info", test_stock_info),
        ("AI Prediction", test_prediction),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"Testing {test_name}...")
        if test_func():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the backend server.")
    
    return passed == total

if __name__ == "__main__":
    main()
