import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import adapter
import { PricePoint } from '../types'; // Your types

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface PriceChartProps {
  priceHistory: PricePoint[];
  assetName: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory, assetName }) => {
  const data = {
    labels: priceHistory.map(p => new Date(p.timestamp * 1000)), // Convert UNIX timestamp to Date
    datasets: [
      {
        label: `${assetName} Price`,
        data: priceHistory.map(p => p.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
        x: {
            type: 'time' as const, // Important for time series
            time: {
                unit: 'minute' as const,
                tooltipFormat: 'PPpp' as const, // e.g. Sep 4, 1995, 2:00:00 PM
                 displayFormats: {
                    minute: 'HH:mm'
                }
            },
            title: {
                display: true,
                text: 'Time'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Price (USD)'
            }
        }
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `${assetName} Price Movement` },
    },
  };

  return <Line options={options} data={data} />;
};

export default PriceChart;