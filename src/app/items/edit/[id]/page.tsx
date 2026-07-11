"use client";
import { useState, useEffect, FormEvent, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ImagePlus, X, Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "phone", label: "Phone" },
  { value: "laptop", label: "Laptop" },
  { value: "camera", label: "Camera" },
  { value: "audio", label: "Audio" },
  { value: "gaming", label: "Gaming" },
  { value: "other", label: "Other" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

interface GadgetData {
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
  sellerId: { _id: string } | null;
}

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("phone");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("used");
  const [status, setStatus] = useState("available");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/items/edit/${id}`);
    }
  }, [authLoading, user, router, id]);

  const fetchGadget = useCallback(async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`/api/gadgets/${id}`);
      const data = await res.json();

      if (!data.success) {
        setNotFound(true);
        return;
      }

      const g: GadgetData = data.data;

      if (user && g.sellerId && g.sellerId._id !== user.id && user.role !== "admin") {
        setForbidden(true);
        return;
      }

      setTitle(g.title);
      setCategory(g.category);
      setPrice(String(g.price));
      setCondition(g.condition);
      setStatus(g.status);
      setShortDescription(g.shortDescription);
      setFullDescription(g.fullDescription);
      setLocation(g.location);
      setImages(g.images || []);
    } catch {
      setError("Could not load this listing");
    } finally {
      setPageLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (user) fetchGadget();
  }, [user, fetchGadget]);

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid image URL");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
    setError("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !title ||
      !category ||
      !price ||
      !condition ||
      !shortDescription ||
      !fullDescription ||
      !location
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (shortDescription.length > 150) {
      setError("Short description must be under 150 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/gadgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          price: Number(price),
          condition,
          status,
          shortDescription,
          fullDescription,
          images,
          location,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to update listing");
        return;
      }

      router.push(`/gadgets/${id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user || pageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-lg font-semibold text-gray-800">Listing not found</h1>
        <Link
          href="/items/manage"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Back to My Listings
        </Link>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-lg font-semibold text-gray-800">
          You don&apos;t have permission to edit this listing
        </h1>
        <Link
          href="/items/manage"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/items/manage"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to My Listings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Edit Listing</h1>
        <p className="mt-1 text-sm text-gray-500">Update the details of your gadget below.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. iPhone 13 Pro Max 256GB"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (৳)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 45000"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Short Description</span>
            <span className="text-xs font-normal text-gray-400">
              {shortDescription.length}/150
            </span>
          </label>
          <input
            type="text"
            value={shortDescription}
            maxLength={150}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A one-line summary shown on the listing card"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Description</label>
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            rows={5}
            placeholder="Describe the condition, accessories included, reason for selling, etc."
            className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Images (URL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {images.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-4 text-xs text-gray-400">
              <ImagePlus size={16} />
              No images added yet. Paste an image URL above and click Add.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}