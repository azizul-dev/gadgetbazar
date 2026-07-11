"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { MapPin, Trash2, Eye, PackageX, Pencil } from "lucide-react";

interface Gadget {
  _id: string;
  title: string;
  category: string;
  price: number;
  condition: "new" | "used" | "refurbished";
  images: string[];
  location: string;
  status: "available" | "sold";
}

export default function ManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Gadget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/items/manage");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchMyGadgets = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/gadgets?sellerId=${user.id}&limit=100&sort=-createdAt`,
        );
        const data = await res.json();

        if (data.success) {
          setGadgets(data.data);
        } else {
          setError("গ্যাজেট লোড করা যায়নি");
        }
      } catch (err) {
        setError("সার্ভারে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGadgets();
  }, [user]);

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
        setError(data.message || "ডিলিট করা যায়নি");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell title="My Listings">
      {authLoading || loading ? (
        <>
          <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-gray-100" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-100"
              >
                <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                <div className="space-y-2 p-3.5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">আমার লিস্টিং</h1>
            <Link
              href="/items/add"
              className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              + নতুন লিস্টিং
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {gadgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <PackageX size={48} className="mb-4 text-gray-300" />
              <p className="mb-4 text-gray-500">আপনার কোনো লিস্টিং নেই এখনো</p>
              <Link
                href="/items/add"
                className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                প্রথম লিস্টিং যোগ করুন
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gadgets.map((gadget) => (
                <div
                  key={gadget._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/60"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gadget.images[0] || "/images/placeholder.png"}
                      alt={gadget.title}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize shadow-sm ${
                        gadget.status === "sold"
                          ? "bg-gray-700/90 text-white"
                          : "bg-teal-500/90 text-white"
                      }`}
                    >
                      {gadget.status === "sold" ? "Sold" : gadget.condition}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                    <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900">
                      {gadget.title}
                    </h3>

                    <p className="flex items-baseline gap-0.5 text-lg font-bold text-blue-600">
                      <span className="text-sm font-semibold">৳</span>
                      {gadget.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="line-clamp-1">{gadget.location}</span>
                    </div>

                    <div className="mt-auto flex gap-2 pt-3">
                      <Link
                        href={`/gadgets/${gadget._id}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-50 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                      <Link
                        href={`/items/edit/${gadget._id}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(gadget)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              ডিলিট কনফার্ম করুন
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              আপনি কি নিশ্চিত{" "}
              <span className="font-medium">{deleteTarget.title}</span> ডিলিট
              করতে চান? এই কাজ ফিরিয়ে নেওয়া যাবে না।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "ডিলিট হচ্ছে..." : "হ্যাঁ, ডিলিট করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
