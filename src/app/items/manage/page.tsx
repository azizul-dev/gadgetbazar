"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

  // লগইন না থাকলে লগইন পেজে পাঠানো (client-side extra safety, middleware দিয়েও প্রোটেক্টেড)
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

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-56 rounded-lg bg-gray-100 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="p-3.5 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">আমার লিস্টিং</h1>
        <Link
          href="/items/add"
          className="text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition-opacity"
        >
          + নতুন লিস্টিং
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {gadgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <PackageX size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">আপনার কোনো লিস্টিং নেই এখনো</p>
          <Link
            href="/items/add"
            className="text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition-opacity"
          >
            প্রথম লিস্টিং যোগ করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gadgets.map((gadget) => (
            <div
              key={gadget._id}
              className="group h-full flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-shadow duration-300"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gadget.images[0] || "/images/placeholder.png"}
                  alt={gadget.title}
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize shadow-sm ${
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

                <div className="mt-auto pt-3 flex gap-2">
                  <Link
                    href={`/gadgets/${gadget._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                  <Link
                    href={`/items/edit/${gadget._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(gadget)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ডিলিট কনফার্ম করুন
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              আপনি কি নিশ্চিত{" "}
              <span className="font-medium">{deleteTarget.title}</span> ডিলিট
              করতে চান? এই কাজ ফিরিয়ে নেওয়া যাবে না।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "ডিলিট হচ্ছে..." : "হ্যাঁ, ডিলিট করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
