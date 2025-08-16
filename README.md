# Stock Market Dashboard

A comprehensive, full-stack stock market dashboard application featuring real-time stock data visualization, AI-powered price predictions, and a modern responsive UI.

## 🚀 Features

### Core Functionality
- **Real-time Stock Data**: Historical price charts with OHLC data
- **Company Portfolio**: 12+ major Indian companies (NSE format)
- **Interactive Charts**: Beautiful Chart.js visualizations with multiple timeframes
- **AI Predictions**: Machine learning-based price predictions using Linear Regression
- **Responsive Design**: Modern UI built with React and TailwindCSS

### Advanced Features
- **52-Week High/Low Tracking**: Visual range indicators
- **Volume Analysis**: Trading volume insights and trends
- **Sector Classification**: Organized by industry sectors
- **Market Metrics**: P/E ratios, dividend yields, market capitalization
- **Prediction Confidence**: AI model confidence scoring system

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11+
- **Database**: SQLite with SQLAlchemy ORM
- **ML Engine**: Scikit-learn for price predictions
- **API**: RESTful endpoints with automatic documentation
- **Data**: Mock dataset with realistic stock patterns

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: TailwindCSS for responsive design
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks for local state

### AI/ML Features
- **Algorithm**: Linear Regression with feature engineering
- **Features**: Price history, volume, momentum indicators
- **Training**: 60-day historical data window
- **Confidence**: Dynamic confidence scoring (60-95%)

## 🛠️ Technology Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Scikit-learn
- **Frontend**: React, TailwindCSS, Chart.js, Axios
- **DevOps**: Docker, Docker Compose
- **Deployment**: Vercel/Render/Railway ready

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-market-dashboard
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Environment Variables**
   ```bash
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:8000/api
   ```

## 🎯 API Endpoints

### Companies
- `GET /api/companies/` - List all companies
- `GET /api/companies/{symbol}` - Get company details

### Stocks
- `GET /api/stocks/{symbol}/historical` - Get historical data
- `GET /api/stocks/{symbol}/info` - Get current stock info

### Predictions
- `GET /api/predictions/{symbol}/predict` - Get AI prediction
- `GET /api/predictions/{symbol}/history` - Get prediction history

## 🎨 UI Components

### Left Panel
- Scrollable company list with sector indicators
- Market cap and P/E ratio displays
- Visual selection states

### Main Panel
- Interactive stock price charts
- Multiple chart types (line, area)
- Responsive chart controls

### Information Cards
- Real-time stock metrics
- AI prediction dashboard
- 52-week range visualization

## 🤖 AI Prediction System

### Model Architecture
- **Algorithm**: Linear Regression
- **Features**: 20+ engineered features
- **Training**: Rolling window approach
- **Validation**: Historical accuracy tracking

### Feature Engineering
- Price momentum (5-day lookback)
- Volume trends and patterns
- Technical indicators
- Market sentiment proxies

### Confidence Scoring
- **High (80-95%)**: Strong historical patterns
- **Medium (60-80%)**: Moderate confidence
- **Low (60-70%)**: Limited pattern strength

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run
docker build -t stock-dashboard .
docker run -p 8000:8000 -p 3000:3000 stock-dashboard
```

### Cloud Deployment
- **Vercel**: Frontend deployment
- **Render**: Backend API hosting
- **Railway**: Full-stack deployment
- **AWS/GCP**: Container deployment

### Environment Variables
```bash
# Production
DATABASE_URL=postgresql://user:pass@host/db
REACT_APP_API_URL=https://api.yourdomain.com
```

## 📊 Data Sources

### Mock Data
- **Companies**: 12 major Indian stocks
- **Sectors**: IT, Banking, Oil & Gas, FMCG, Telecom
- **Data**: Realistic price patterns and volumes

### Live Data Integration
- **Yahoo Finance**: Real-time stock data
- **Alpha Vantage**: Market data API
- **NSE/BSE**: Indian market feeds

## 🔧 Development

### Code Structure
```
├── backend/
│   ├── main.py          # FastAPI app
│   ├── database.py      # Database models
│   ├── routers/         # API endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app
│   ├── package.json
│   └── tailwind.config.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Development Commands
```bash
# Backend development
cd backend && uvicorn main:app --reload

# Frontend development
cd frontend && npm start

# Database reset
rm backend/stock_dashboard.db
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test endpoints
curl http://localhost:8000/api/companies/
curl http://localhost:8000/api/stocks/RELIANCE/info
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Component-based code splitting
- **Caching**: API response caching
- **Compression**: Gzip compression for static assets
- **CDN Ready**: Optimized for CDN deployment

### Benchmarks
- **Page Load**: < 2 seconds
- **Chart Rendering**: < 500ms
- **API Response**: < 200ms
- **Prediction**: < 1 second

## 🔒 Security

### Security Features
- **CORS**: Configured for production
- **Input Validation**: Pydantic models
- **SQL Injection**: SQLAlchemy ORM protection
- **Rate Limiting**: API request throttling

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards
- **Python**: PEP 8, type hints
- **JavaScript**: ESLint, Prettier
- **CSS**: TailwindCSS conventions
- **Git**: Conventional commits


## 🙏 Acknowledgments

- **Chart.js**: Beautiful charting library
- **TailwindCSS**: Utility-first CSS framework
- **FastAPI**: Modern Python web framework
- **React**: Declarative UI library

## 📞 Support

For support and questions:
- **Issues**: GitHub Issues
- **Documentation**: API docs at `/docs`
- **Email**: [bendiv@iitbhilai.ac.in]

---

**Built with ❤️ using modern web technologies**
