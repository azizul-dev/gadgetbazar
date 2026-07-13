"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Star, Loader2, Trash2, MessageSquare } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: { _id: string; name: string } | null;
}

export default function ReviewSection({ gadgetId }: { gadgetId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gadgets/${gadgetId}/reviews`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data.reviews);
        setAverage(json.data.average);
        setCount(json.data.count);
      }
    } catch {
      // রিভিউ সাপ্লিমেন্টারি — চুপচাপ ফেইল করবে, পেজ ব্লক হবে না
    } finally {
      setLoading(false);
    }
  }, [gadgetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const myReview = reviews.find(
    (r) => r.userId && user && r.userId._id === user.id
  );

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myReview?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("একটি রেটিং সিলেক্ট করুন");
      return;
    }
    if (!comment.trim()) {
      setError("রিভিউ লিখুন");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/gadgets/${gadgetId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "রিভিউ জমা দেওয়া যায়নি");
        return;
      }

      await fetchReviews();
    } catch {
      setError("সার্ভারের সাথে কানেক্ট করা যায়নি");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setRating(0);
        setComment("");
        await fetchReviews();
      }
    } catch {
      // silent fail
    }
  };

  const renderStars = (value: number, size = 16) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Reviews &amp; Ratings
        </h2>
        {count > 0 && (
          <div className="flex items-center gap-2">
            {renderStars(Math.round(average))}
            <span className="text-sm font-medium text-gray-700">
              {average} <span className="text-gray-400">({count})</span>
            </span>
          </div>
        )}
      </div>

      {/* Review form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-4"
        >
          <p className="mb-2 text-sm font-medium text-gray-700">
            {myReview ? "আপনার রিভিউ আপডেট করুন" : "একটি রিভিউ দিন"}
          </p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={22}
                  className={
                    n <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {myReview ? "আপডেট করুন" : "সাবমিট করুন"}
            </button>
            {myReview && (
              <button
                type="button"
                onClick={() => handleDelete(myReview._id)}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-700"
              >
                <Trash2 size={14} />
                মুছে ফেলুন
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-600">
          রিভিউ দিতে হলে{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            লগইন করুন
          </a>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-blue-600" size={22} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
          <MessageSquare size={30} className="mb-2" />
          <p className="text-sm">এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    {r.userId?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {r.userId?.name || "ব্যবহারকারী"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="mt-2">{renderStars(r.rating, 14)}</div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
