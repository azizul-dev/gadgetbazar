"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Loader2, Users, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const LIMIT = 10;

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/admin/users");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const fetchUsers = useCallback(async () => {
    try {
      setDataLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Could not load users");
        return;
      }

      setUsers(data.data);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setDataLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user, fetchUsers]);

  // সার্চ পরিবর্তন হলে page 1-এ ফিরিয়ে আনা
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (authLoading || !user || user.role !== "admin") {
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

  return (
    <DashboardShell title="Users">
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-blue-300/25 blur-[100px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/25">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Users
                </h1>
                <p className="text-sm text-gray-500">
                  {total} registered {total === 1 ? "user" : "users"}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Joined</th>
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  {dataLoading ? (
                    <tbody>
                      <tr>
                        <td colSpan={4} className="px-5 py-16 text-center">
                          <Loader2
                            className="mx-auto animate-spin text-blue-600"
                            size={24}
                          />
                        </td>
                      </tr>
                    </tbody>
                  ) : users.length === 0 ? (
                    <tbody>
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-16 text-center text-sm text-gray-400"
                        >
                          No users found.
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <motion.tbody
                      key={page + search}
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
                          <td className="px-5 py-3.5 font-medium text-gray-800">
                            {u.name}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-5 py-3.5">
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
                          <td className="px-5 py-3.5 text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  )}
                </AnimatePresence>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex items-center justify-between"
            >
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}