import React from 'react';
import { MarketDataResponse, TradeIdea, Alert, AlertCreate } from '../types';
import PriceChart from './PriceChart';
import IndicatorChart from './IndicatorChart'; // You'll need to adapt/create this for MACD too
import TrendDisplay from './TrendDisplay';
import SentimentDisplay from './SentimentDisplay';
import TradeIdeaCard from './TradeIdeaCard';
import AlertManager from './AlertManager';

interface DashboardProps {
  marketData: MarketDataResponse | null;
  tradeIdea: TradeIdea | null;
  activeAlerts: Alert[];
  onSetAlert: (alertData: AlertCreate) => Promise<void>;
  onDeleteAlert: (alertId: string) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ marketData, tradeIdea, activeAlerts, onSetAlert, onDeleteAlert }) => {
  if (!marketData) {
    return <div className="text-center p-10">Loading dashboard data...</div>;
  }

  const { price_history, trend, indicators, sentiment, current_price } = marketData;

  const rsiData = price_history.map((_, index) => {
    // This is a placeholder. RSI needs to be calculated over the series and aligned.
    // For simplicity, assuming indicators object has a series or use the single latest value.
    // A better approach is if 'indicators' object also contained historical series for charting.
    // For MVP, we might just show the latest RSI value textually and chart only the price.
    // Or, if indicators from backend contains array for charting, use that.
    // For this example, let's assume indicators object only has the latest value
    // so we can't directly plot historical RSI easily without backend changes.
    // We'll plot a constant line for demo or pass historical from backend.
    // For a real chart, backend should provide historical indicator values.
    return indicators.rsi; // This would just plot a flat line for the latest RSI.
  });


  // Prepare MACD data similarly if you have it from backend
  const macdLineData = price_history.map(() => indicators.macd_line);
  const macdSignalData = price_history.map(() => indicators.macd_signal);
  // const macdHistData = price_history.map(() => indicators.macd_hist); // For bar chart


  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-blue-500 text-white rounded shadow text-center">
            <h3 className="text-sm font-semibold uppercase">BTC/USD Current Price</h3>
            <p className="text-3xl font-bold">${current_price.toFixed(2)}</p>
        </div>
        <TrendDisplay trend={trend} />
        <SentimentDisplay sentiment={sentiment} />
      </div>

      <TradeIdeaCard idea={tradeIdea} />

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">BTC/USD Price Chart</h2>
        <PriceChart priceHistory={price_history} assetName="BTC/USD" />
      
        {/* Indicator Charts - these require historical data from backend or calculation on frontend */}
        {indicators.rsi !== null && indicators.rsi !== undefined && (
             <div className="mt-4">
                <IndicatorChart
                    priceHistory={price_history} // for x-axis alignment
                    indicatorData={price_history.map(() => indicators.rsi)} // Faking historical for demo
                    indicatorName="RSI (14)"
                    color="purple"
                    yMin={0} yMax={100}
                    thresholds={[{value: 70, color: 'red', label: 'Overbought'}, {value: 30, color: 'green', label: 'Oversold'}]}
                />
             </div>
        )}
        {/* MACD Chart would go here, potentially needing a more complex IndicatorChart component */}
        {indicators.macd_line !== null && indicators.macd_line !== undefined && (
            <div className="mt-4">
                {/* Simplified: Just showing text for MACD for now */}
                <h4 className="text-md font-semibold">MACD:</h4>
                <p className="text-sm">Line: {indicators.macd_line?.toFixed(2)}, Signal: {indicators.macd_signal?.toFixed(2)}, Hist: {indicators.macd_hist?.toFixed(2)}</p>
                {/* A proper MACD chart would require plotting lines and histogram */}
            </div>
        )}
      </div>
      
      <AlertManager activeAlerts={activeAlerts} onSetAlert={onSetAlert} onDeleteAlert={onDeleteAlert} />
    </div>
  );
};

export default Dashboard;