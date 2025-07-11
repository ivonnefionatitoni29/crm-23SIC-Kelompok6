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
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../supabase"; // Pastikan path ini benar!

// Register Chart.js components
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

// Component untuk animasi angka
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

  // State untuk data statistik kartu (SEKARANG AKAN MENYIMPAN TOTAL)
  const [totalCustomers, setTotalCustomers] = useState(0); // Berubah dari newCustomers
  const [totalReservations, setTotalReservations] = useState(0); // Berubah dari reservationsThisMonth
  const [totalProductsSold, setTotalProductsSold] = useState(0); // Berubah dari productsSold
  const [avgLoyaltyPoints, setAvgLoyaltyPoints] = useState(0);

  // State untuk data chart (INI TETAP UNTUK TAHUN INI)
  const [monthlySalesData, setMonthlySalesData] = useState(new Array(12).fill(0));
  const [customerGrowthData, setCustomerGrowthData] = useState(new Array(12).fill(0));

  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0-indexed for Date object

        // Variabel untuk filter bulanan (masih dibutuhkan untuk chart)
        const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999).toISOString();

        // Variabel untuk filter tahunan (masih dibutuhkan untuk chart)
        const startOfYear = new Date(currentYear, 0, 1).toISOString();
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999).toISOString();

        // --- Ambil Total Pelanggan ---
        // Hapus filter tanggal untuk mendapatkan TOTAL dari semua waktu
        const { count: totalCustomersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true }); // Tanpa .gte/.lte
        if (usersError) throw usersError;
        setTotalCustomers(totalCustomersCount || 0);

        // --- Ambil Total Reservasi (Kebiri, Penitipan, Vaksinasi) ---
        // Hapus filter tanggal untuk mendapatkan TOTAL dari semua waktu
        const { count: kebiriCount, error: kebiriError } = await supabase
          .from("kebiri")
          .select("*", { count: "exact", head: true }); // Tanpa .gte/.lte
        if (kebiriError) throw kebiriError;

        const { count: penitipanCount, error: penitipanError } = await supabase
          .from("penitipan")
          .select("*", { count: "exact", head: true }); // Tanpa .gte/.lte
        if (penitipanError) throw penitipanError;

        const { count: vaksinasiCount, error: vaksinasiError } = await supabase
          .from("vaksinasi")
          .select("*", { count: "exact", head: true }); // Tanpa .gte/.lte
        if (vaksinasiError) throw vaksinasiError;

        setTotalReservations((kebiriCount || 0) + (penitipanCount || 0) + (vaksinasiCount || 0));

        // --- Ambil Total Produk Terjual ---
        // Hapus filter tanggal untuk mendapatkan TOTAL dari semua waktu
        const { data: productsData, error: productsError } = await supabase
          .from("datapembelian")
          .select("jumlah"); // Tanpa .gte/.lte
        if (productsError) throw productsError;
        const totalProductsSoldCount = productsData.reduce((sum, item) => sum + (item.jumlah || 0), 0);
        setTotalProductsSold(totalProductsSoldCount);

        // --- Ambil Data Rata-rata Poin Loyalitas ---
        // Query ini memang sudah mengambil total karena tidak ada filter tanggal
        const { data: loyaltyData, error: loyaltyError } = await supabase
          .from("dataloyalitas")
          .select("poinloyalitas");
        if (loyaltyError) throw loyaltyError;
        const totalLoyaltyPoints = loyaltyData.reduce((sum, item) => sum + (item.poinloyalitas || 0), 0);
        const averagePoints = loyaltyData.length > 0 ? totalLoyaltyPoints / loyaltyData.length : 0;
        setAvgLoyaltyPoints(Math.round(averagePoints));

        // --- Ambil Data Penjualan Bulanan untuk Bar Chart (TETAP TAHUN INI) ---
        const { data: salesChartRawData, error: salesChartError } = await supabase
          .from("datapembelian")
          .select("tanggal, total")
          .gte("tanggal", startOfYear)
          .lte("tanggal", endOfYear);
        if (salesChartError) throw salesChartError;

        const monthlySalesAggregate = new Array(12).fill(0);
        salesChartRawData.forEach(sale => {
          const monthIndex = new Date(sale.tanggal).getMonth();
          monthlySalesAggregate[monthIndex] += parseFloat(sale.total || 0);
        });
        setMonthlySalesData(monthlySalesAggregate.map(value => value / 1000));

        // --- Ambil Data Pertumbuhan Pelanggan untuk Line Chart (TETAP TAHUN INI) ---
        const { data: usersChartRawData, error: usersChartError } = await supabase
          .from("users")
          .select("created_at")
          .gte("created_at", startOfYear)
          .lte("created_at", endOfYear);
        if (usersChartError) throw usersChartError;

        const monthlyCustomerAggregate = new Array(12).fill(0);
        usersChartRawData.forEach(user => {
          const monthIndex = new Date(user.created_at).getMonth();
          monthlyCustomerAggregate[monthIndex]++;
        });
        setCustomerGrowthData(monthlyCustomerAggregate);

      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
        setError("Gagal memuat data dashboard. Periksa koneksi atau konsol untuk detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data statis untuk kartu (percent masih placeholder, bisa dibuat dinamis jika ada data perbandingan)
  const stats = [
    {
      label: "Total Pelanggan", // Label berubah
      value: totalCustomers, // Menggunakan state baru
      percent: 12, // Placeholder
      colorFrom: "from-blue-500",
      colorTo: "to-blue-700",
      icon: <User className="w-7 h-7 text-white" />,
    },
    {
      label: "Total Reservasi", // Label berubah
      value: totalReservations, // Menggunakan state baru
      percent: 8, // Placeholder
      colorFrom: "from-green-400",
      colorTo: "to-green-600",
      icon: <PawPrint className="w-7 h-7 text-white" />,
    },
    {
      label: "Total Produk Terjual", // Label berubah
      value: totalProductsSold, // Menggunakan state baru
      percent: 10, // Placeholder
      colorFrom: "from-purple-500",
      colorTo: "to-purple-700",
      icon: <ShoppingBag className="w-7 h-7 text-white" />,
    },
    {
      label: "Rata-rata Poin Loyalitas",
      value: avgLoyaltyPoints,
      percent: 5, // Placeholder
      colorFrom: "from-yellow-400",
      colorTo: "to-yellow-600",
      icon: <Star className="w-7 h-7 text-white" />,
    },
  ];

  // Data dan Opsi Chart (tetap sama karena ini sudah mengambil data tahunan)
  const barData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ],
    datasets: [
      {
        label: "Penjualan (dalam ribuan $)",
        data: monthlySalesData,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Penjualan Bulanan Tahun Ini" },
    },
  };

  const lineData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ],
    datasets: [
      {
        label: "Jumlah Pelanggan",
        data: customerGrowthData,
        borderColor: "rgba(59, 130, 246, 1)",
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
      legend: { position: "top" },
      title: { display: true, text: "Pertumbuhan Pelanggan Tahun Ini" },
    },
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-indigo-700 font-semibold">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-red-100 flex flex-col items-center justify-center">
        <p className="text-xl text-red-700 font-semibold mb-4">Terjadi Kesalahan:</p>
        <p className="text-lg text-red-600 text-center">{error}</p>
        <p className="text-sm text-red-500 mt-2">Pastikan Supabase Anda terhubung dan RLS sudah dikonfigurasi.</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-white space-y-10">
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

      {/* Grafik Penjualan Bulanan */}
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