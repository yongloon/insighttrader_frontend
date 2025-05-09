import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import Dashboard from '../components/Dashboard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { MarketDataResponse, TradeIdea, Alert, AlertCreate } from '../types';
import { fetchMarketData, fetchTradeIdea, checkActiveAlerts, postAlert, deleteAlertApi } from '../lib/api';
// Import mock data
import { mockMarketData, mockTradeIdeaBuy, mockTradeIdeaHold, mockActiveAlerts as initialMockAlerts } from '../lib/mockData'; // Adjust path if needed

// --- SET THIS FLAG TO TRUE TO USE MOCK DATA ---
const USE_MOCK_DATA = true; // Or manage via an environment variable for more flexibility
// ----------------------------------------------

export default function HomePage() {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(USE_MOCK_DATA ? mockMarketData : null);
  const [tradeIdea, setTradeIdea] = useState<TradeIdea | null>(USE_MOCK_DATA ? mockTradeIdeaBuy : null); // Or mockTradeIdeaHold
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>(USE_MOCK_DATA ? [...initialMockAlerts] : []); // Use a copy for mock
  const [triggeredAlertMessages, setTriggeredAlertMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(!USE_MOCK_DATA); // Don't show loading if using mock data initially
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      // Optionally, simulate some delay or dynamic changes for mock data here if needed
      // For now, mock data is static once set initially.
      setMarketData(prev => ({ // Simulate a price update
        ...mockMarketData,
        current_price: prev ? prev.current_price + (Math.random() * 100 - 50) : mockMarketData.current_price,
        price_history: [...(prev?.price_history || mockMarketData.price_history).slice(1), {timestamp: Date.now()/1000, price: (prev ? prev.current_price + (Math.random() * 100 - 50) : mockMarketData.current_price) }]
      }));
      setLoading(false);
      setError(null);
      return;
    }

    // setLoading(true); // Avoid flicker on refetch
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const pollAlerts = useCallback(async () => {
    if (USE_MOCK_DATA) {
      // Simulate an alert triggering for mock data
      const currentMockPrice = marketData?.current_price || 0;
      const newlyTriggeredMessages: string[] = [];
      const updatedMockAlerts = activeAlerts.filter(alert => {
        let triggered = false;
        if (!alert.triggered) {
            if (alert.direction === 'above' && currentMockPrice > alert.price_level) {
                triggered = true;
            } else if (alert.direction === 'below' && currentMockPrice < alert.price_level) {
                triggered = true;
            }
        }
        if (triggered) {
            const message = `MOCK ALERT: ${alert.asset} has gone ${alert.direction} ${alert.price_level}!`;
            newlyTriggeredMessages.push(message);
            if (typeof window !== "undefined" && Notification.permission === "granted") {
                new Notification("Mock Trade Alert!", { body: message });
            }
            return false; // Remove triggered alert from active list
        }
        return true;
      });
      if (newlyTriggeredMessages.length > 0) {
        setTriggeredAlertMessages(prev => [...newlyTriggeredMessages, ...prev.slice(0, 4 - newlyTriggeredMessages.length)]);
        setActiveAlerts(updatedMockAlerts);
      }
      return;
    }

    try {
        const triggeredBackendAlerts = await checkActiveAlerts();
        // ... (rest of the API alert logic remains the same) ...
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
        console.error("Failed to check alerts:", error);
    }
  }, [USE_MOCK_DATA, activeAlerts, marketData?.current_price]); // Add dependencies for mock logic


  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Set initial mock data without API calls
      setMarketData(mockMarketData);
      setTradeIdea(mockTradeIdeaBuy); // Or mockTradeIdeaHold
      setActiveAlerts([...initialMockAlerts]);
      setLoading(false);
    } else {
      setLoading(true); // For initial load when not using mock
      fetchData(); // Initial fetch if not using mock data
    }

    const dataInterval = setInterval(fetchData, USE_MOCK_DATA ? 3000 : 7000); // Shorter interval for mock data updates if desired
    const alertInterval = setInterval(pollAlerts, USE_MOCK_DATA ? 5000 : 10000);

    if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                // console.log("Notification permission:", permission);
            });
        }
    }

    return () => {
      clearInterval(dataInterval);
      clearInterval(alertInterval);
    };
  }, [USE_MOCK_DATA, fetchData, pollAlerts]); // Add USE_MOCK_DATA to dependency array

  const handleSetAlert = async (alertData: AlertCreate) => {
    if (USE_MOCK_DATA) {
      const newMockAlert: Alert = {
        ...alertData,
        id: `mock-${Date.now()}`,
        asset: 'BTC/USD',
        triggered: false,
        created_at: Date.now() / 1000,
      };
      setActiveAlerts(prev => [...prev, newMockAlert]);
      alert(`Mock Alert set for BTC/USD ${alertData.direction} ${alertData.price_level}`);
      return;
    }
    try {
        const newAlert = await postAlert(alertData);
        setActiveAlerts(prev => [...prev, newAlert]);
        alert(`Alert set for BTC/USD ${alertData.direction} ${alertData.price_level}`);
    } catch (error) {
        alert(`Failed to set alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (USE_MOCK_DATA) {
      setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
      return;
    }
    try {
        await deleteAlertApi(alertId);
        setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (error) {
        alert(`Failed to delete alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
  };

  // --- Render logic remains largely the same ---
  if (loading && !marketData) return <p className="text-center mt-20 text-xl">Loading InsightTrader AI...</p>;
  // Allow rendering with mock data even if error state was previously set from API attempt
  if (error && !marketData && !USE_MOCK_DATA) return <p className="text-center mt-20 text-xl text-red-500">Error: {error}</p>;


  return (
    <>
      <Head>
        <title>InsightTrader AI (MVP{USE_MOCK_DATA ? " - Mock Data" : ""})</title>
        <meta name="description" content="MVP Smart Trading Analyzer for BTC/USD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <h1 className="text-2xl font-bold text-center">
              InsightTrader AI 
              <span className="text-sm font-light"> (MVP - BTC/USD {USE_MOCK_DATA ? "Simulated with Mock Frontend Data" : "Simulated via Backend"})</span>
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
            
            {/* Render dashboard if marketData (mock or real) is available */}
            {marketData ? (
                <Dashboard
                marketData={marketData}
                tradeIdea={tradeIdea} // tradeIdea can also be from mock data
                activeAlerts={activeAlerts}
                onSetAlert={handleSetAlert}
                onDeleteAlert={handleDeleteAlert}
                />
            ) : (
                 !error && <p className="text-center mt-10 text-lg">Fetching latest market data...</p>
            )}
             {error && marketData && !USE_MOCK_DATA && <p className="text-center my-4 text-md text-red-500">Error updating data: {error}. Displaying last known data.</p>}
        </main>

        <footer className="text-center text-xs text-gray-500 p-4 border-t border-gray-300">
            © {new Date().getFullYear()} InsightTrader AI MVP. For educational purposes only.
        </footer>
      </div>
    </>
  );
}