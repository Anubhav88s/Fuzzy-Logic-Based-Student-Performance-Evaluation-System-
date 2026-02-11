'use client';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from './Card';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ inputs }) => {
  const data = {
    labels: ['Attendance', 'Assignment', 'Exam', 'Participation'],
    datasets: [
      {
        label: 'Student Profile',
        data: [inputs.attendance, inputs.assignment, inputs.exam, inputs.participation],
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 2.5,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.15)' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        pointLabels: {
          font: { size: 11, weight: '600' },
          color: 'rgba(100, 116, 139, 1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 25,
          backdropColor: 'transparent',
          font: { size: 9 },
          color: 'rgba(148, 163, 184, 0.7)',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
        📊 Input Profile
      </h3>
      <Radar data={data} options={options} />
    </Card>
  );
};

export default RadarChart;
