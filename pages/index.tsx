import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import Dashboard from '../components/Dashboard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { MarketDataResponse, TradeIdea, Alert, AlertCreate } from '../types';
import { fetchMarketData, fetchTradeIdea, checkActiveAlerts, postAlert, deleteAlertApi } from '../lib/api';
// Mock data imports are no longer strictly needed here for operation, but can be kept for quick switching if desired
// import { mockMarketData, mockTradeIdeaBuy, mockActiveAlerts as initialMockAlerts } from '../lib/mockData';

// --- SET THIS FLAG TO FALSE TO USE REAL API DATA ---
const USE_MOCK_DATA = false; // <<<<<<< CHANGE THIS TO false
// ---------------------------------------------------
// OR, for better practice, use an environment variable:
// const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default function HomePage() {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null); // Initialize to null for API
  const [tradeIdea, setTradeIdea] = useState<TradeIdea | null>(null);            // Initialize to null for API
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);                 // Initialize empty for API
  const [triggeredAlertMessages, setTriggeredAlertMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true when using API
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      // Mock data logic (can be removed or kept for easy switching)
      // For now, if USE_MOCK_DATA is false, this block is skipped.
      console.log("Using mock data for fetchData - this should not happen if USE_MOCK_DATA is false.");
      setLoading(false);
      return;
    }

    // setLoading(true); // Avoid UI flicker on refetch, manage initial load separately
    try {
      const [md, ti] = await Promise.all([
        fetchMarketData(),
        fetchTradeIdea(),
      ]);
      setMarketData(md);
      setTradeIdea(ti);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching data');
      console.error("API Error in fetchData:", err);
    } finally {
      // setLoading(false); // Only set loading to false after initial load
    }
  }, []); // Removed USE_MOCK_DATA from deps as it's constant within this scope or should be outside

  const pollAlerts = useCallback(async () => {
    if (USE_MOCK_DATA) {
      // Mock data logic (can be removed or kept)
      console.log("Using mock data for pollAlerts - this should not happen if USE_MOCK_DATA is false.");
      return;
    }

    try {
        const triggeredBackendAlerts = await checkActiveAlerts();
        if (triggeredBackendAlerts.length > 0) {
            const newMessages: string[] = [];
            triggeredBackendAlerts.forEach(alert => {
                const message = `ALERT: ${alert.asset} has gone ${alert.direction} ${alert.price_level}!`;
                newMessages.push(message);
                if (typeof window !== "undefined" && Notification.permission === "granted") {
                    new Notification("Trade Alert!", { body: message });
                }
            });
            setTriggeredAlertMessages(prev => [...newMessages, ...prev.slice(0, 4-newMessages.length)]);
             setActiveAlerts(prevAlerts => prevAlerts.filter(
                pa => !triggeredBackendAlerts.some(ta => ta.id === pa.id)
            ));
        }
    } catch (error) {
        console.error("API Error in pollAlerts:", error);
        // Optionally set an error state for alert checking
    }
  }, []); // Removed USE_MOCK_DATA


  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Initialize with mock data if flag is true (can be removed or kept)
      // setMarketData(mockMarketData);
      // setTradeIdea(mockTradeIdeaBuy);
      // setActiveAlerts([...initialMockAlerts]);
      setLoading(false); // No loading needed for mock data
      console.log("Initializing with MOCK data - this path should be skipped if USE_MOCK_DATA is false.");
    } else {
      setLoading(true); // Set loading true for initial API fetch
      fetchData().finally(() => setLoading(false)); // Fetch initial data and then set loading false
    }

    // Set up intervals regardless of mock/real, they will behave based on USE_MOCK_DATA inside their callbacks
    const dataInterval = setInterval(fetchData, 7000);
    const alertInterval = setInterval(pollAlerts, 10000);

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }

    return () => {
      clearInterval(dataInterval);
      clearInterval(alertInterval);
    };
  }, [fetchData, pollAlerts]); // USE_MOCK_DATA is not needed here if its value doesn't change during component lifecycle


  const handleSetAlert = async (alertData: AlertCreate) => {
    if (USE_MOCK_DATA) {
      // Mock data logic (can be removed or kept)
      console.log("Using mock data for handleSetAlert.");
      return;
    }
    try {
        const newAlert = await postAlert(alertData);
        setActiveAlerts(prev => [...prev, newAlert]); // Optimistically add to UI
        alert(`Alert set for BTC/USD ${alertData.direction} ${alertData.price_level}`);
    } catch (error) {
        alert(`Failed to set alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error("API Error in handleSetAlert:", error);
        throw error;
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (USE_MOCK_DATA) {
      // Mock data logic (can be removed or kept)
      console.log("Using mock data for handleDeleteAlert.");
      return;
    }
    try {
        await deleteAlertApi(alertId);
        setActiveAlerts(prev => prev.filter(a => a.id !== alertId)); // Optimistically remove
    } catch (error) {
        alert(`Failed to delete alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error("API Error in handleDeleteAlert:", error);
        throw error;
    }
  };

  if (loading) return <p className="text-center mt-20 text-xl">Loading InsightTrader AI...</p>;
  if (error && !marketData) return <p className="text-center mt-20 text-xl text-red-500">Error: {error}</p>;

  return (
    <>
      <Head>
        <title>InsightTrader AI (MVP)</title> {/* Removed mock data indicator from title */}
        <meta name="description" content="MVP Smart Trading Analyzer for BTC/USD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <h1 className="text-2xl font-bold text-center">
              InsightTrader AI 
              <span className="text-sm font-light"> (MVP - BTC/USD Simulated via Backend)</span>
            </h1>
        </header>

        <main className="pb-8">
            <DisclaimerBanner />

            {triggeredAlertMessages.length > 0 && (
                <div className="container mx-auto px-4">
                    {triggeredAlertMessages.map((msg, idx) => (
                        <div key={idx} className="bg-yellow-200 text-yellow-800 p-3 mb-2 rounded-md text-center text-sm shadow">
                            {msg}
                        </div>
                    ))}
                     <button onClick={() => setTriggeredAlertMessages([])} className="text-xs text-gray-500 underline block mx-auto mb-2">Dismiss All Alerts</button>
                </div>
            )}
            
            {marketData ? (
                <Dashboard
                  marketData={marketData}
                  tradeIdea={tradeIdea}
                  activeAlerts={activeAlerts}
                  onSetAlert={handleSetAlert}
                  onDeleteAlert={handleDeleteAlert}
                />
            ) : (
                 !error && <p className="text-center mt-10 text-lg">Waiting for market data...</p> // Changed message
            )}
            {/* Display error message if data fetch failed but we are not in loading state anymore */}
            {error && !loading && <p className="text-center my-4 text-md text-red-500">Failed to load data: {error}. Retrying periodically.</p>}
        </main>

        <footer className="text-center text-xs text-gray-500 p-4 border-t border-gray-300">
            © {new Date().getFullYear()} InsightTrader AI MVP. For educational purposes only.
        </footer>
      </div>
    </>
  );
}