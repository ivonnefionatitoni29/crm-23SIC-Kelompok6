import React, { useEffect, useState } from "react";
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
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  User,
  CalendarDays,
  PawPrint,
  ShoppingBag,
  Star,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/,/g, ""));
    if (start === end) return;

    let totalDuration = 1500;
    let incrementTime = 30;
    let steps = totalDuration / incrementTime;
    let increment = Math.ceil(end / steps);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [value]);

  const formattedValue = displayValue.toLocaleString();

  return <span>{formattedValue}</span>;
};

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    const storedUser = localStorage.getItem("userName") || "Admin Groovy";
    setUserName(storedUser);
  }, []);

  const stats = [
    {
      label: "Pelanggan Baru",
      value: 312,
      percent: 12,
      colorFrom: "from-blue-500",
      colorTo: "to-blue-700",
      icon: <User className="w-7 h-7 text-white" />,
    },
    {
      label: "Reservasi Bulan Ini",
      value: 985,
      percent: 8,
      colorFrom: "from-green-400",
      colorTo: "to-green-600",
      icon: <PawPrint className="w-7 h-7 text-white" />,
    },
    {
      label: "Produk Terjual",
      value: 1240,
      percent: 10,
      colorFrom: "from-purple-500",
      colorTo: "to-purple-700",
      icon: <ShoppingBag className="w-7 h-7 text-white" />,
    },
    {
      label: "Rata-rata Poin Loyalitas",
      value: 145,
      percent: 5,
      colorFrom: "from-yellow-400",
      colorTo: "to-yellow-600",
      icon: <Star className="w-7 h-7 text-white" />,
    },
  ];

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "Penjualan (dalam ribuan $)",
        data: [12, 19, 14, 17, 22, 30, 28, 26, 32, 35, 40, 45],
        backgroundColor: "rgba(99, 102, 241, 0.7)", // purple-600
      },
    ],
  };

  const barOptions = {
    responsive: true,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Penjualan Bulanan Tahun Ini' },
    },
  }

  // Data untuk grafik Pertumbuhan Pelanggan (Line Chart)
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "Jumlah Pelanggan",
        data: [50, 75, 120, 180, 220, 260, 300, 350, 400, 430, 460, 500],
        borderColor: "rgba(59, 130, 246, 1)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Pertumbuhan Pelanggan Tahun Ini' },
    },
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-50 to-white space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow-md">
            Dashboard Admin
          </h1>
          <p className="text-lg text-indigo-600">
            Selamat datang,{" "}
            <span className="font-semibold text-indigo-900">{userName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-indigo-500 font-medium">
          <CalendarDays className="w-6 h-6" />
          <span className="text-sm md:text-base">{currentDate}</span>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ label, value, percent, colorFrom, colorTo, icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorFrom} ${colorTo} shadow-lg text-white p-6 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium opacity-90">{label}</p>
              <div className="p-2 rounded-full bg-white/25">{icon}</div>
            </div>
            {/* Ubah posisi angka dan persen */}
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold drop-shadow-lg leading-none">
                <AnimatedNumber value={value} />
              </h2>
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full select-none shadow-sm flex items-center justify-center ${
                  percent > 0
                    ? "bg-green-900/80 text-green-400"
                    : "bg-red-900/80 text-red-400"
                }`}
                style={{ minWidth: "48px", height: "28px" }}
              >
                {percent > 0 ? `+${percent}%` : `${percent}%`}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grafik Reservasi */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <Bar options={barOptions} data={barData} />
      </div>

      {/* Grafik Pertumbuhan Pelanggan */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <Line options={lineOptions} data={lineData} />
      </div>
    </div>
  );
};

export default Dashboard;
