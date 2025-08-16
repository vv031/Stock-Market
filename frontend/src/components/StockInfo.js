import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react';

const StockInfo = ({ info, company }) => {
  if (!info) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>Loading stock information...</p>
        </div>
      </div>
    );
  }

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000) {
      return `₹${(marketCap / 1000000).toFixed(1)}T`;
    } else if (marketCap >= 1000) {
      return `₹${(marketCap / 1000).toFixed(1)}B`;
    }
    return `₹${marketCap.toFixed(1)}M`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Stock Information</h3>
      </div>

      <div className="space-y-4">
        {/* Current Price and Change */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Price</span>
            <span className="text-sm text-gray-600">Change</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ₹{info.current_price.toFixed(2)}
            </span>
            <div className={`flex items-center space-x-1 ${getChangeColor(info.change)}`}>
              {getChangeIcon(info.change)}
              <span className="text-lg font-semibold">
                {info.change >= 0 ? '+' : ''}₹{info.change.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium ${getChangeColor(info.change_percent)}`}>
              {info.change_percent >= 0 ? '+' : ''}{info.change_percent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Volume</span>
            </div>
            <p className="text-lg font-semibold text-blue-900">
              {formatVolume(info.volume)}
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Market Cap</span>
            </div>
            <p className="text-lg font-semibold text-green-900">
              {formatMarketCap(info.market_cap)}
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <PieChart className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-700 font-medium">P/E Ratio</span>
            </div>
            <p className="text-lg font-semibold text-purple-900">
              {info.pe_ratio.toFixed(2)}
            </p>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-700 font-medium">Dividend Yield</span>
            </div>
            <p className="text-lg font-semibold text-orange-900">
              {info.dividend_yield.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 52-Week Range */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">52-Week Range</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">52W Low</p>
              <p className="text-sm font-semibold text-danger-600">
                ₹{info.week_52_low.toFixed(2)}
              </p>
            </div>
            <div className="flex-1 mx-4">
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-2 bg-gradient-to-r from-danger-500 to-success-500 rounded-full"
                  style={{
                    left: `${((info.current_price - info.week_52_low) / (info.week_52_high - info.week_52_low)) * 100}%`,
                    width: '4px',
                    height: '100%',
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">52W High</p>
              <p className="text-sm font-semibold text-success-600">
                ₹{info.week_52_high.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        {company && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Company:</span>
              <span className="text-sm text-gray-600">{company.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sector:</span>
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {company.sector}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInfo;
