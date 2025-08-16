import React from 'react';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';

const CompanyList = ({ companies, selectedCompany, onCompanySelect }) => {
  const getSectorColor = (sector) => {
    const colors = {
      'IT': 'bg-blue-100 text-blue-800',
      'Banking': 'bg-green-100 text-green-800',
      'Oil & Gas': 'bg-orange-100 text-orange-800',
      'FMCG': 'bg-purple-100 text-purple-800',
      'Telecom': 'bg-indigo-100 text-indigo-800',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000) {
      return `₹${(marketCap / 1000000).toFixed(1)}T`;
    } else if (marketCap >= 1000) {
      return `₹${(marketCap / 1000).toFixed(1)}B`;
    }
    return `₹${marketCap.toFixed(1)}M`;
  };

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Companies</h2>
        <span className="text-sm text-gray-500">{companies.length} stocks</span>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {companies.map((company) => {
          const isSelected = selectedCompany?.symbol === company.symbol;
          const isPositive = company.pe_ratio > 0;
          
          return (
            <div
              key={company.symbol}
              onClick={() => onCompanySelect(company)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900 truncate">
                      {company.symbol}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {company.name}
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(company.sector)}`}>
                      {company.sector}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {formatMarketCap(company.market_cap)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-success-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-danger-500" />
                      )}
                      <span className={`font-medium ${
                        isPositive ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        P/E: {company.pe_ratio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {companies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No companies available</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
