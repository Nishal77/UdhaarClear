'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthData {
  month: string
  invoiced: number
  collected: number
}

export function CollectionChart({ data }: { data: MonthData[] }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Invoiced',
        data: data.map((d) => d.invoiced),
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Collected',
        data: data.map((d) => d.collected),
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Collection Trend</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) =>
                  `₹${(Number(value) / 1000).toFixed(0)}K`,
              },
            },
          },
        }}
      />
    </div>
  )
}
