"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import CategoryChart from "@/components/dashboard/CategoryChart";
import { Loader2, Users, Package, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const fetchCounts = useCallback(async () => {
    try {
      setDataLoading(true);
      setError("");

      const [usersRes, allRes, soldRes] = await Promise.all([
        fetch("/api/users?limit=1"),
        fetch("/api/gadgets?status=available&limit=1"),
        fetch("/api/gadgets?status=sold&limit=1"),
      ]);

      const usersData = await usersRes.json();
      const allData = await allRes.json();
      const soldData = await soldRes.json();

      if (!usersData.success) {
        setError(usersData.message || "Could not load stats");
        return;
      }

      setTotalUsers(usersData.pagination?.total ?? 0);
      setTotalListings(
        (allData.pagination?.total ?? 0) + (soldData.pagination?.total ?? 0)
      );
      setSoldCount(soldData.pagination?.total ?? 0);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") fetchCounts();
  }, [user, fetchCounts]);

  if (authLoading || !user || user.role !== "admin" || dataLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-blue-600" size={32} />
        </motion.div>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      value: totalUsers,
      label: "Total Users",
      gradient: "from-blue-500 to-blue-600",
      glow: "shadow-blue-500/25",
      bg: "bg-blue-500/10",
    },
    {
      icon: Package,
      value: totalListings,
      label: "Total Listings",
      gradient: "from-teal-500 to-teal-600",
      glow: "shadow-teal-500/25",
      bg: "bg-teal-500/10",
    },
    {
      icon: CheckCircle2,
      value: soldCount,
      label: "Sold Items",
      gradient: "from-amber-500 to-amber-600",
      glow: "shadow-amber-500/25",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <DashboardShell title="Admin Dashboard">
      <div className="relative overflow-hidden">
        {/* Animated glow orbs */}
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-300/30 blur-[100px]"
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-teal-300/30 blur-[100px]"
          animate={{ scale: [1.1, 1, 1.1], y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/30"
            >
              <ShieldAlert className="text-white" size={22} />
            </motion.div>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Admin Dashboard
                <Sparkles size={18} className="text-amber-400" />
              </h1>
              <p className="text-sm text-gray-500">
                A quick overview of GadgetBazar&rsquo;s activity
              </p>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            </motion.div>
          )}

          {/* Stat cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 transition-transform duration-500 group-hover:scale-125`}
                />
                <div className="relative flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} p-3 text-white shadow-lg ${stat.glow}`}
                  >
                    <stat.icon size={22} />
                  </motion.div>
                  <div>
                    <motion.p
                      key={stat.value}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-3xl font-black tracking-tight text-gray-900"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Category chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            className="mb-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
          >
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Package size={18} className="text-teal-600" />
              Listings by Category
            </h2>
            <CategoryChart />
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}