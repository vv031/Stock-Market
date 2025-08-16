import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3,
  Calendar,
  Zap,
  AlertCircle
} from 'lucide-react';

const PredictionCard = ({ prediction, company }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!prediction) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Prediction</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Prediction not available</p>
          <p className="text-xs text-gray-400 mt-1">
            AI model needs more data
          </p>
        </div>
      </div>
    );
  }

  const getPredictionColor = (direction) => {
    return direction === 'UP' ? 'text-success-600' : 'text-danger-600';
  };

  const getPredictionIcon = (direction) => {
    return direction === 'UP' ? (
      <TrendingUp className="w-5 h-5" />
    ) : (
      <TrendingDown className="w-5 h-5" />
    );
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success-600';
    if (confidence >= 0.6) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const calculatePotentialReturn = () => {
    const currentPrice = prediction.current_price;
    const predictedPrice = prediction.predicted_price;
    const returnPercent = ((predictedPrice - currentPrice) / currentPrice) * 100;
    return returnPercent;
  };

  const potentialReturn = calculatePotentialReturn();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Prediction</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Main Prediction */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Predicted Price</span>
            <div className={`flex items-center space-x-1 ${getPredictionColor(prediction.price_direction)}`}>
              {getPredictionIcon(prediction.price_direction)}
              <span className="text-xs font-medium">
                {prediction.price_direction}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{prediction.predicted_price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Price</span>
            <span className="font-medium text-gray-900">
              ₹{prediction.current_price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Confidence and Return */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Confidence</span>
            </div>
            <p className={`text-lg font-semibold ${getConfidenceColor(prediction.confidence)}`}>
              {(prediction.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">
              {getConfidenceLevel(prediction.confidence)} Confidence
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Potential Return</span>
            </div>
            <p className={`text-lg font-semibold ${getPredictionColor(prediction.price_direction)}`}>
              {potentialReturn >= 0 ? '+' : ''}{potentialReturn.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600">
              {prediction.price_direction === 'UP' ? 'Gain' : 'Loss'}
            </p>
          </div>
        </div>

        {/* Prediction Date */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Prediction Date:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(prediction.prediction_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium mb-1">AI Prediction Disclaimer</p>
              <p>
                This prediction is based on historical data analysis and should not be considered as financial advice. 
                Always consult with financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <h4 className="font-medium text-gray-800">Model Details</h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Algorithm:</span>
                <span className="ml-2 font-medium">Linear Regression</span>
              </div>
              <div>
                <span className="text-gray-600">Features:</span>
                <span className="ml-2 font-medium">Price + Volume + Momentum</span>
              </div>
              <div>
                <span className="text-gray-600">Training Data:</span>
                <span className="ml-2 font-medium">60 days</span>
              </div>
              <div>
                <span className="text-gray-600">Update Frequency:</span>
                <span className="ml-2 font-medium">Daily</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> The AI model analyzes historical price patterns, volume trends, 
                and market momentum to generate predictions. Higher confidence levels indicate 
                stronger historical patterns supporting the prediction.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
