import React, { useState, useEffect } from 'react';
import CompanyList from './components/CompanyList';
import StockChart from './components/StockChart';
import StockInfo from './components/StockInfo';
import PredictionCard from './components/PredictionCard';
import Header from './components/Header';
import { fetchCompanies, fetchStockData, fetchStockInfo, fetchPrediction } from './services/api';

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await fetchCompanies();
      setCompanies(data);
      if (data.length > 0) {
        handleCompanySelect(data[0]);
      }
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    }
  };

  const handleCompanySelect = async (company) => {
    setSelectedCompany(company);
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stock data and info in parallel
      const [data, info] = await Promise.all([
        fetchStockData(company.symbol),
        fetchStockInfo(company.symbol)
      ]);
      
      setStockData(data);
      setStockInfo(info);
      
      // Fetch prediction
      try {
        const pred = await fetchPrediction(company.symbol);
        setPrediction(pred);
      } catch (predErr) {
        console.warn('Prediction failed:', predErr);
        setPrediction(null);
      }
    } catch (err) {
      setError('Failed to load stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Company List */}
          <div className="lg:col-span-1">
            <CompanyList 
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />
          </div>
          
          {/* Main Panel - Charts and Info */}
          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-center text-red-800">
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {selectedCompany && (
              <>
                {/* Stock Chart */}
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {selectedCompany.name} ({selectedCompany.symbol})
                  </h2>
                  {loading ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <StockChart data={stockData} company={selectedCompany} />
                  )}
                </div>
                
                {/* Stock Info and Prediction */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StockInfo info={stockInfo} company={selectedCompany} />
                  <PredictionCard prediction={prediction} company={selectedCompany} />
                </div>
              </>
            )}
            
            {!selectedCompany && !loading && (
              <div className="card text-center py-12">
                <div className="text-gray-500">
                  <p className="text-lg">Select a company to view stock data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
