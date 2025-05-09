import React, { useState } from 'react';
import { Alert, AlertCreate } from '../types';

interface AlertManagerProps {
  activeAlerts: Alert[];
  onSetAlert: (alertData: AlertCreate) => Promise<void>;
  onDeleteAlert: (alertId: string) => Promise<void>;
}

const AlertManager: React.FC<AlertManagerProps> = ({ activeAlerts, onSetAlert, onDeleteAlert }) => {
  const [priceLevel, setPriceLevel] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const level = parseFloat(priceLevel);
    if (isNaN(level) || level <= 0) {
      setError('Please enter a valid price level.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSetAlert({ price_level: level, direction });
      setPriceLevel(''); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set alert.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Price Alerts (BTC/USD)</h3>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <div>
          <label htmlFor="priceLevel" className="block text-sm font-medium text-gray-700">
            Price Level ($)
          </label>
          <input
            type="number"
            id="priceLevel"
            value={priceLevel}
            onChange={(e) => setPriceLevel(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 67000"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
            Notify me when price is
          </label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Setting...' : 'Set Alert'}
        </button>
      </form>
      
      {activeAlerts.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-600 mb-2">Active Alerts:</h4>
          <ul className="space-y-1 text-sm">
            {activeAlerts.map((alert) => (
              <li key={alert.id} className="flex justify-between items-center p-1 bg-gray-100 rounded">
                <span>BTC/USD {alert.direction} ${alert.price_level.toFixed(2)}</span>
                <button 
                  onClick={async () => {
                    try { await onDeleteAlert(alert.id); } 
                    catch (e) { console.error("Failed to delete alert UI:", e); alert("Failed to delete alert");}
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlertManager;