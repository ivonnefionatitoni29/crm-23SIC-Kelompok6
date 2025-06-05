import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  // Data summary cards
  const stats = [
    { label: "Pasien Hari Ini", value: "38 ekor", percent: "+8%", color: "green" },
    { label: "Janji Temu Hari Ini", value: "25", percent: "-5%", color: "blue" },
    { label: "Pelanggan Baru", value: "+12", percent: "+10%", color: "red" },
    { label: "Tingkat Kepuasan", value: "96%", percent: "+1%", color: "purple" },
  ]

  // Data untuk grafik Penjualan Bulanan (diubah menjadi Janji Temu Bulanan)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Janji Temu",
        data: [40, 55, 60, 50, 70, 90, 100, 95, 85, 80, 75, 95],
        backgroundColor: "rgba(34, 197, 94, 0.7)", // green-500
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statistik Janji Temu Tahun Ini' },
    },
  }

  // Data untuk grafik Pertumbuhan Pelanggan (diubah jadi Pasien Baru)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Pasien Baru",
        data: [20, 30, 25, 35, 45, 60, 70, 65, 55, 58, 62, 75],
        borderColor: "rgba(139, 92, 246, 1)", // purple-500
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Pertumbuhan Pasien Baru' },
    },
  }

  return (
    <div className="p-6 space-y-8">
      {/* Statistik utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, percent, color }) => (
          <div key={label} className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className={`text-2xl font-bold text-${color}-600 flex items-center gap-2`}>
              {value}
              <span className={`text-xs font-semibold text-${color}-500`}>{percent}</span>
            </h2>
          </div>
        ))}
      </div>

      {/* Grafik Penjualan Bulanan */}
      <div className="bg-white rounded-xl shadow p-6">
        <Bar options={barOptions} data={barData} />
      </div>

      {/* Grafik Pertumbuhan Pelanggan */}
      <div className="bg-white rounded-xl shadow p-6">
        <Line options={lineOptions} data={lineData} />
      </div>
    </div>
  )
}

export default Dashboard
