"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  Users,
  Package,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AdminGadget {
  _id: string;
  title: string;
  price: number;
  status: "available" | "sold";
  sellerId: { _id: string; name: string; email: string } | null;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [gadgets, setGadgets] = useState<AdminGadget[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminGadget | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError("");

      const [usersRes, availableRes, soldRes] = await Promise.all([
        fetch("/api/users?limit=100"),
        fetch("/api/gadgets?status=available&limit=200"),
        fetch("/api/gadgets?status=sold&limit=200"),
      ]);

      const usersData = await usersRes.json();
      const availableData = await availableRes.json();
      const soldData = await soldRes.json();

      if (!usersData.success) {
        setError(usersData.message || "Could not load users");
        return;
      }

      setUsers(usersData.data);

      const allGadgets = [
        ...(availableData.success ? availableData.data : []),
        ...(soldData.success ? soldData.data : []),
      ];
      allGadgets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setGadgets(allGadgets);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") fetchData();
  }, [user, fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/gadgets/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setGadgets((prev) => prev.filter((g) => g._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        setError(data.message || "Failed to delete listing");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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

  const soldCount = gadgets.filter((g) => g.status === "sold").length;

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-teal-200/30 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/25">
            <ShieldAlert className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage users and listings across GadgetBazar
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {[
            {
              icon: Users,
              value: users.length,
              label: "Total Users",
              gradient: "from-blue-500 to-blue-600",
              glow: "shadow-blue-500/20",
            },
            {
              icon: Package,
              value: gadgets.length,
              label: "Total Listings",
              gradient: "from-teal-500 to-teal-600",
              glow: "shadow-teal-500/20",
            },
            {
              icon: CheckCircle2,
              value: soldCount,
              label: "Sold Items",
              gradient: "from-amber-500 to-amber-600",
              glow: "shadow-amber-500/20",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 transition-transform duration-500 group-hover:scale-125`}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.glow}`}
                >
                  <stat.icon size={22} />
                </div>
                <div>
                  <motion.p
                    key={stat.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Users table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users size={18} className="text-blue-600" />
            Users
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {users.map((u) => (
                  <motion.tr
                    key={u._id}
                    variants={rowVariants}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          u.role === "admin"
                            ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>

        {/* Gadgets table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Package size={18} className="text-teal-600" />
            All Listings
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {gadgets.map((g) => (
                  <motion.tr
                    key={g._id}
                    variants={rowVariants}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <Link
                        href={`/gadgets/${g._id}`}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-blue-600"
                      >
                        {g.title}
                        <ExternalLink
                          size={12}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {g.sellerId ? g.sellerId.name : "Unknown"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      ৳{g.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          g.status === "sold"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteTarget(g)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 size={13} />
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>

        {/* Delete confirmation modal */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
              onClick={() => !deleting && setDeleteTarget(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Delete this listing?
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{deleteTarget.title}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}