import { MarketDataResponse, TradeIdea, PricePoint, SentimentData, IndicatorValues, Alert } from '../types';

// Helper to generate some price history
const generateMockPriceHistory = (points: number = 100, startPrice: number = 65000): PricePoint[] => {
  const history: PricePoint[] = [];
  let currentPrice = startPrice;
  const now = Date.now();
  for (let i = 0; i < points; i++) {
    history.push({
      timestamp: (now - (points - 1 - i) * 60 * 1000) / 1000, // Simulate 1-minute intervals in seconds
      price: parseFloat(currentPrice.toFixed(2)),
    });
    currentPrice += Math.random() * 200 - 100; // Random fluctuation
    if (currentPrice < 10000) currentPrice = 10000;
  }
  return history;
};

const mockPriceHistory = generateMockPriceHistory();
const mockCurrentPrice = mockPriceHistory[mockPriceHistory.length - 1]?.price || 65000;

export const mockSentimentData: SentimentData = {
  text: "BTC looks strong today, expecting a push towards new highs! #Bitcoin 🚀",
  sentiment_score: 0.75,
  sentiment_label: "Positive",
};

export const mockIndicatorValues: IndicatorValues = {
  rsi: 55.75,
  macd_line: 150.20,
  macd_signal: 130.10,
  macd_hist: 20.10,
  sma_short: 65100.50,
  sma_long: 64800.90,
};

export const mockMarketData: MarketDataResponse = {
  asset: "BTC/USD (Mock)",
  current_price: mockCurrentPrice,
  price_history: mockPriceHistory,
  trend: "Uptrend",
  indicators: mockIndicatorValues,
  sentiment: mockSentimentData,
};

export const mockTradeIdeaBuy: TradeIdea = {
  asset: "BTC/USD (Mock)",
  action: "BUY",
  entry_price: mockCurrentPrice,
  stop_loss: mockCurrentPrice * 0.985,
  take_profit: mockCurrentPrice * 1.03,
  confidence: "Medium",
  reason: "Mock Data: Uptrend detected with RSI in a neutral-bullish zone and positive sentiment.",
};

export const mockTradeIdeaHold: TradeIdea = {
  asset: "BTC/USD (Mock)",
  action: "HOLD",
  confidence: "None",
  reason: "Mock Data: Conditions are neutral; awaiting a clearer signal.",
};

export const mockActiveAlerts: Alert[] = [
  {
    id: 'mock-alert-1',
    asset: 'BTC/USD',
    price_level: 68000,
    direction: 'above',
    triggered: false,
    created_at: Date.now() / 1000 - 3600 // 1 hour ago
  },
  {
    id: 'mock-alert-2',
    asset: 'BTC/USD',
    price_level: 62000,
    direction: 'below',
    triggered: false,
    created_at: Date.now() / 1000 - 7200 // 2 hours ago
  },
];