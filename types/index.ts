// Mirror Pydantic models closely

export interface PricePoint {
    timestamp: number; // Unix timestamp (seconds)
    price: number;
  }
  
  export interface IndicatorValues {
    rsi?: number | null;
    macd_line?: number | null;
    macd_signal?: number | null;
    macd_hist?: number | null;
    sma_short?: number | null;
    sma_long?: number | null;
  }
  
  export interface SentimentData {
    text: string;
    sentiment_score: number;
    sentiment_label: "Positive" | "Negative" | "Neutral" | string; // Allow string for flexibility
  }
  
  export interface MarketDataResponse {
    asset: string;
    current_price: number;
    price_history: PricePoint[];
    trend: string;
    indicators: IndicatorValues;
    sentiment: SentimentData;
  }
  
  export interface TradeIdea {
    asset: string;
    action: "BUY" | "SELL" | "HOLD";
    entry_price?: number | null;
    stop_loss?: number | null;
    take_profit?: number | null;
    confidence: "High" | "Medium" | "Low" | "None" | string;
    reason: string;
  }
  
  export interface AlertBase {
    price_level: number;
    direction: "above" | "below";
  }
  
  export interface AlertCreate extends AlertBase {}
  
  export interface Alert extends AlertBase {
    id: string;
    asset: string;
    triggered: boolean;
    created_at: number;
  }