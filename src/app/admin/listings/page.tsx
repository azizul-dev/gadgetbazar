"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  ExternalLink,
} from "lucide-react";

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
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const LIMIT = 10;

export default function AdminListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [gadgets, setGadgets] = useState<AdminGadget[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminGadget | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/admin/listings");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const fetchGadgets = useCallback(async () => {
    try {
      setDataLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      else params.set("status", ""); // sold + available উভয়ই — API-তে status খালি দিলে ফিল্টার হবে না

      const res = await fetch(`/api/gadgets?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Could not load listings");
        return;
      }

      setGadgets(data.data);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setDataLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    if (user?.role === "admin") fetchGadgets();
  }, [user, fetchGadgets]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/gadgets/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setDeleteTarget(null);
        fetchGadgets();
      } else {
        setError(data.message || "Failed to delete listing");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
    <DashboardShell title="All Listings">
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-teal-300/25 blur-[100px]"
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/25">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  All Listings
                </h1>
                <p className="text-sm text-gray-500">
                  {total} {total === 1 ? "listing" : "listings"} across the marketplace
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "available" | "sold")
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
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
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Seller</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  {dataLoading ? (
                    <tbody>
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center">
                          <Loader2
                            className="mx-auto animate-spin text-blue-600"
                            size={24}
                          />
                        </td>
                      </tr>
                    </tbody>
                  ) : gadgets.length === 0 ? (
                    <tbody>
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-16 text-center text-sm text-gray-400"
                        >
                          No listings found.
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <motion.tbody
                      key={page + search + statusFilter}
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {gadgets.map((g) => (
                        <motion.tr
                          key={g._id}
                          variants={rowVariants}
                          className="group border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/60"
                        >
                          <td className="px-5 py-3.5 font-medium text-gray-800">
                            <Link
                              href={`/gadgets/${g._id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 transition-colors hover:text-blue-600"
                            >
                              {g.title}
                              <ExternalLink
                                size={12}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </Link>
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {g.sellerId ? g.sellerId.name : "Unknown"}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-blue-600">
                            ৳{g.price.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5">
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
                          <td className="px-5 py-3.5 text-right">
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

        {/* Delete confirm modal */}
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
                  <span className="font-medium">{deleteTarget.title}</span>? This
                  action cannot be undone.
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
    </DashboardShell>
  );
}