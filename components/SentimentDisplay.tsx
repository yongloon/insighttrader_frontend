import React from 'react';
import { SentimentData } from '../types';

interface SentimentDisplayProps {
  sentiment: SentimentData | null;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  if (!sentiment) return <div className="p-3 bg-gray-50 rounded shadow"><p>Loading sentiment...</p></div>;

  let sentimentColor = 'text-gray-700';
  let emoji = '😐';
  if (sentiment.sentiment_label === 'Positive') {
    sentimentColor = 'text-green-600';
    emoji = '😊';
  } else if (sentiment.sentiment_label === 'Negative') {
    sentimentColor = 'text-red-600';
    emoji = '😟';
  }

  return (
    <div className="p-3 bg-gray-50 rounded shadow">
      <h3 className="text-sm font-semibold text-gray-500 mb-1">Simulated X Sentiment {emoji}</h3>
      <p className={`text-md font-semibold ${sentimentColor}`}>{sentiment.sentiment_label}</p>
      <p className="text-xs text-gray-500 mt-1 italic">"{sentiment.text}"</p>
    </div>
  );
};

export default SentimentDisplay;