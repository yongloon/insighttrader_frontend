import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { PricePoint } from '../types'; // Assuming timestamps are in PricePoint

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface IndicatorChartProps {
  priceHistory: PricePoint[]; // To align timestamps
  indicatorData: (number | null | undefined)[]; // Array of RSI values
  indicatorName: string;
  color: string;
  yMin?: number;
  yMax?: number;
  thresholds?: { value: number; color: string; label: string }[];
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({ priceHistory, indicatorData, indicatorName, color, yMin, yMax, thresholds }) => {
  const labels = priceHistory.map(p => new Date(p.timestamp * 1000));

  const datasets = [
    {
      label: indicatorName,
      data: indicatorData,
      borderColor: color,
      backgroundColor: `${color}33`, // Light fill
      tension: 0.1,
      pointRadius: 0, // No points for indicator lines generally
    },
  ];

  // Add threshold lines
  if (thresholds) {
    thresholds.forEach(t => {
      datasets.push({
        label: t.label,
        data: Array(labels.length).fill(t.value),
        borderColor: t.color,
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 1,
        // @ts-ignore // fill not standard, but Chart.js might support it or need plugin
        fill: false,
      } as any); // Cast to any if Chart.js types complain about custom props
    });
  }


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: { unit: 'minute' as const, displayFormats: { minute: 'HH:mm' } },
        ticks: { display: false } // Hide x-axis labels for sub-charts to save space
      },
      y: {
        title: { display: true, text: indicatorName },
        min: yMin,
        max: yMax,
      },
    },
    plugins: {
      legend: { display: false }, // Usually no legend for single indicator sub-chart
      title: { display: true, text: `${indicatorName}` },
    },
  };

  return <div style={{ height: '150px' }}><Line options={options} data={{ labels, datasets }} /></div>;
};

export default IndicatorChart;