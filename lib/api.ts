import { MarketDataResponse, TradeIdea, Alert, AlertCreate } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchMarketData(): Promise<MarketDataResponse> {
    const response = await fetch(`${API_BASE_URL}/market-data`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch market data' }));
        throw new Error(errorData.detail || 'Failed to fetch market data');
    }
    return response.json();
}

export async function fetchTradeIdea(): Promise<TradeIdea> { // Ensure backend always returns a TradeIdea, even if it's "HOLD"
    const response = await fetch(`${API_BASE_URL}/trade-idea`);
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch trade idea' }));
        throw new Error(errorData.detail || 'Failed to fetch trade idea');
    }
    return response.json();
}

export async function postAlert(alertData: AlertCreate): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to set alert' }));
        throw new Error(errorData.detail || 'Failed to set alert');
    }
    return response.json();
}

export async function checkActiveAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/check-alerts`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to check alerts' }));
        throw new Error(errorData.detail || 'Failed to check alerts');
    }
    return response.json();
}

export async function deleteAlertApi(alertId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 is success with no content
        const errorData = await response.json().catch(() => ({ detail: 'Failed to delete alert' }));
        throw new Error(errorData.detail || 'Failed to delete alert');
    }
}