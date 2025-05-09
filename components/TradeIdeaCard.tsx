import React from 'react';
import { TradeIdea } from '../types';

interface TradeIdeaCardProps {
  idea: TradeIdea | null;
}

const TradeIdeaCard: React.FC<TradeIdeaCardProps> = ({ idea }) => {
  if (!idea) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Trade Idea</h3>
        <p className="text-gray-500">Calculating trade idea...</p>
      </div>
    );
  }

  let actionColor = 'text-gray-700';
  let bgColor = 'bg-gray-100';
  if (idea.action === 'BUY') {
    actionColor = 'text-green-600';
    bgColor = 'bg-green-50';
  } else if (idea.action === 'SELL') {
    actionColor = 'text-red-600';
    bgColor = 'bg-red-50';
  }

  return (
    <div className={`p-4 rounded-lg shadow-md border ${bgColor} border-gray-200`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Trade Idea (BTC/USD)</h3>
      {idea.action === 'HOLD' ? (
        <p className="text-gray-600 font-semibold text-xl">ACTION: <span className={actionColor}>{idea.action}</span></p>
      ) : (
        <>
          <p className="text-gray-600 font-semibold text-xl">ACTION: <span className={actionColor}>{idea.action}</span></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
            <p><strong>Entry:</strong> ${idea.entry_price?.toFixed(2)}</p>
            <p><strong>Stop Loss:</strong> ${idea.stop_loss?.toFixed(2)}</p>
            <p><strong>Take Profit:</strong> ${idea.take_profit?.toFixed(2)}</p>
          </div>
        </>
      )}
      <p className="mt-1 text-sm"><strong>Confidence:</strong> {idea.confidence}</p>
      <p className="mt-1 text-xs text-gray-500"><strong>Reason:</strong> {idea.reason}</p>
    </div>
  );
};

export default TradeIdeaCard;