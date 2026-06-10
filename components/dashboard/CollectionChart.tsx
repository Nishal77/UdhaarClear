'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatINRCompact } from '@/lib/utils/currency'
import Link from 'next/link'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface MonthData {
  month: string
  invoiced: number
  collected: number
}

export function CollectionChart({ data }: { data: MonthData[] }) {
  const totalInvoiced = data.reduce((s, d) => s + d.invoiced, 0)
  const totalCollected = data.reduce((s, d) => s + d.collected, 0)
  const recoveryPct =
    totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0
  const avgDays = 14 // static placeholder — wire from DB if needed

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Invoiced',
        data: data.map((d) => d.invoiced),
        borderColor: '#4F46E5',
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const canvas = ctx.chart.ctx
          const chartArea = ctx.chart.chartArea
          if (!chartArea) return 'rgba(79,70,229,0.08)'
          const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(79,70,229,0.18)')
          gradient.addColorStop(1, 'rgba(79,70,229,0.01)')
          return gradient
        },
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Collected',
        data: data.map((d) => d.collected),
        borderColor: '#10B981',
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const canvas = ctx.chart.ctx
          const chartArea = ctx.chart.chartArea
          if (!chartArea) return 'rgba(16,185,129,0.08)'
          const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(16,185,129,0.18)')
          gradient.addColorStop(1, 'rgba(16,185,129,0.01)')
          return gradient
        },
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] border border-black/4 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Recovery Trend</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Last 6 months invoiced vs collected</p>
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-700 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 16,
                  font: { family: 'Instrument Sans', size: 11 },
                  color: '#6B7280',
                  boxWidth: 7,
                  boxHeight: 7,
                },
              },
              tooltip: {
                backgroundColor: '#0D0F14',
                titleColor: '#9CA3AF',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 10,
                titleFont: { family: 'Instrument Sans', size: 11 },
                bodyFont: { family: 'Instrument Sans', size: 13, weight: 'bold' },
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ${formatINRCompact(ctx.parsed.y ?? 0)}`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                  font: { family: 'Instrument Sans', size: 11 },
                  color: '#9CA3AF',
                },
              },
              y: {
                grid: { color: 'rgba(0,0,0,0.04)' },
                border: { display: false, dash: [4, 4] },
                ticks: {
                  font: { family: 'Instrument Sans', size: 11 },
                  color: '#9CA3AF',
                  callback: (v) => formatINRCompact(Number(v)),
                  maxTicksLimit: 5,
                },
              },
            },
          }}
        />
      </div>

      {/* Footer stats */}
      <div className="mt-5 flex items-center gap-6 border-t border-gray-50 pt-4">
        <div>
          <p className="text-[11px] text-gray-400">Avg recovery time</p>
          <p className="text-[14px] font-bold text-gray-900">{avgDays} days</p>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <div>
          <p className="text-[11px] text-gray-400">Recovery rate</p>
          <p className="text-[14px] font-bold text-emerald-600">{recoveryPct}%</p>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <div>
          <p className="text-[11px] text-gray-400">Total invoiced</p>
          <p className="text-[14px] font-bold text-gray-900">{formatINRCompact(totalInvoiced)}</p>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <div>
          <p className="text-[11px] text-gray-400">Total collected</p>
          <p className="text-[14px] font-bold text-gray-900">{formatINRCompact(totalCollected)}</p>
        </div>
      </div>
    </div>
  )
}
