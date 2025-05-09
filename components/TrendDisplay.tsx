import React from 'react';

interface TrendDisplayProps {
  trend: string;
}

const TrendDisplay: React.FC<TrendDisplayProps> = ({ trend }) => {
  let trendColor = 'text-gray-700';
  if (trend.toLowerCase().includes('bullish') || trend.toLowerCase().includes('uptrend')) {
    trendColor = 'text-green-600';
  } else if (trend.toLowerCase().includes('bearish') || trend.toLowerCase().includes('downtrend')) {
    trendColor = 'text-red-600';
  }

  return (
    <div className="p-3 bg-gray-50 rounded shadow">
      <h3 className="text-sm font-semibold text-gray-500 mb-1">Market Trend</h3>
      <p className={`text-lg font-bold ${trendColor}`}>{trend || 'Calculating...'}</p>
    </div>
  );
};

export default TrendDisplay;