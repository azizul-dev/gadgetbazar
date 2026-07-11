"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Loader2,
  Pencil,
  Trash2,
  ArrowLeft,
  User as UserIcon,
  Mail,
  PackageX,
} from "lucide-react";

interface GadgetDetail {
  _id: string;
  title: string;
  category: string;
  price: number;
  condition: "new" | "used" | "refurbished";
  shortDescription: string;
  fullDescription: string;
  images: string[];
  location: string;
  status: "available" | "sold";
  createdAt: string;
  sellerId: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

const conditionColor: Record<string, string> = {
  new: "bg-teal-500/90 text-white",
  used: "bg-amber-500/90 text-white",
  refurbished: "bg-blue-500/90 text-white",
};

export default function GadgetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [gadget, setGadget] = useState<GadgetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchGadget = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/gadgets/${id}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Gadget not found");
        return;
      }

      setGadget(json.data);
      setActiveImage(0);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchGadget();
  }, [id, fetchGadget]);

  const isOwner = !!(user && gadget?.sellerId && user.id === gadget.sellerId._id);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/gadgets/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Failed to delete listing");
        setDeleting(false);
        return;
      }

      router.push("/gadgets");
    } catch {
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <PackageX size={44} className="mb-4 text-gray-300" />
        <h1 className="text-lg font-semibold text-gray-800">
          {error || "Gadget not found"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link
          href="/gadgets"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>
      </div>
    );
  }

  const images = gadget.images.length > 0 ? gadget.images : ["/images/placeholder.png"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/gadgets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImage]}
              alt={gadget.title}
              className="h-full w-full object-cover"
            />
            {gadget.status === "sold" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-gray-900">
                  SOLD
                </span>
              </div>
            )}
            <span
              className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm backdrop-blur-sm ${conditionColor[gadget.condition]}`}
            >
              {gadget.condition}
            </span>
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
            {gadget.category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{gadget.title}</h1>

          <p className="mt-3 flex items-baseline gap-1 text-3xl font-bold text-blue-600">
            <span className="text-lg font-semibold">৳</span>
            {gadget.price.toLocaleString()}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={15} />
            {gadget.location}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{gadget.shortDescription}</p>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-800">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {gadget.fullDescription}
            </p>
          </div>

          {gadget.sellerId && (
            <div className="mt-6 rounded-2xl border border-gray-100 p-4">
              <h2 className="mb-3 text-sm font-semibold text-gray-800">Seller</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon size={15} className="text-gray-400" />
                {gadget.sellerId.name}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-600">
                <Mail size={15} className="text-gray-400" />
                {gadget.sellerId.email}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="mt-6 flex gap-3">
              <Link
                href={`/items/manage`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Pencil size={15} />
                Edit Listing
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Delete this listing?</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
