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

const generatePoints = (func, params) => {
  const points = [];
  for (let x = 0; x <= 100; x += 1) {
    points.push(func(x, ...params));
  }
  return points;
};

const MembershipChart = ({ variable = 'performance', title }) => {
  const labels = Array.from({ length: 101 }, (_, i) => i);
  const sets = FUZZY_SETS[variable];

  const colorPalette = [
    { border: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.15)' },
    { border: 'rgba(59, 130, 246, 1)', bg: 'rgba(59, 130, 246, 0.15)' },
    { border: 'rgba(16, 185, 129, 1)', bg: 'rgba(16, 185, 129, 0.15)' },
    { border: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.15)' },
  ];

  const datasets = Object.entries(sets).map(([setName, params], index) => {
    const colors = colorPalette[index % colorPalette.length];
    const isTrap = params.length === 4;
    const data = generatePoints(isTrap ? trapmf : trimf, params);

    return {
      label: setName.charAt(0).toUpperCase() + setName.slice(1),
      data,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 2,
    };
  });

  const data = { labels, datasets };

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
        title: { display: true, text: 'µ(x)', font: { size: 11, weight: '600' } },
      },
      x: {
        grid: { display: false },
        ticks: {
          maxTicksLimit: 6,
          font: { size: 10 },
        },
        title: { display: true, text: 'Value', font: { size: 11, weight: '600' } },
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
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {title || variable.charAt(0).toUpperCase() + variable.slice(1)}
      </h3>
      <Line data={data} options={options} />
    </Card>
  );
};

export default MembershipChart;
