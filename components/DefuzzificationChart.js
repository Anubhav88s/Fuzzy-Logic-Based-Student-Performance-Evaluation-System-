'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import Card from './Card';
import { trimf, trapmf, FUZZY_SETS } from '@/lib/fuzzy';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DefuzzificationChart = ({ aggregated, score }) => {
  const labels = Array.from({ length: 101 }, (_, i) => i);

  const aggregatedData = labels.map((x) => {
    const muPoor = Math.min(aggregated.poor, trapmf(x, ...FUZZY_SETS.performance.poor));
    const muAverage = Math.min(aggregated.average, trimf(x, ...FUZZY_SETS.performance.average));
    const muGood = Math.min(aggregated.good, trimf(x, ...FUZZY_SETS.performance.good));
    const muExcellent = Math.min(aggregated.excellent, trapmf(x, ...FUZZY_SETS.performance.excellent));
    return Math.max(muPoor, muAverage, muGood, muExcellent);
  });

  // Create centroid vertical line data
  const centroidLine = labels.map((l) => {
    const rounded = Math.round(score);
    if (l === rounded) return Math.max(...aggregatedData.filter((_, i) => Math.abs(i - rounded) <= 1)) || 0.5;
    return null;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Aggregated Output',
        data: aggregatedData,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2.5,
      },
      {
        label: `Centroid: ${score.toFixed(1)}`,
        data: centroidLine,
        pointRadius: 8,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointHoverRadius: 10,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1.1,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { size: 10 } },
        title: { display: true, text: 'Degree', font: { size: 11, weight: '600' } },
      },
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 6, font: { size: 10 } },
        title: { display: true, text: 'Score', font: { size: 11, weight: '600' } },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 15, usePointStyle: true, pointStyleWidth: 10, font: { size: 11 } },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        🎯 Defuzzification (Centroid Method)
      </h3>
      <Line data={data} options={options} />
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        The shaded area is the aggregated fuzzy output. The red dot marks the centroid at <span className="font-semibold">{score.toFixed(2)}</span>.
      </p>
    </Card>
  );
};

export default DefuzzificationChart;
