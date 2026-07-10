"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "লগইন ব্যর্থ হয়েছে");
        setLoading(false);
        return;
      }

      await refetchUser();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-teal-50/40 px-4 py-16">
      {/* Animated glow blobs - Hero এর সাথে মিলিয়ে */}
      <motion.div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-blue-300 rounded-full blur-[100px] opacity-40"
        animate={{ scale: [1, 1.25, 1], x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-24 w-[420px] h-[420px] bg-teal-300 rounded-full blur-[100px] opacity-35"
        animate={{ scale: [1.15, 1, 1.15], x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      >
        <div className="text-center mb-8">
          <span className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200">
            স্বাগতম
          </span>
          <h1 className="text-3xl font-bold text-gray-900">লগইন করুন</h1>
          <p className="mt-2 text-gray-600 text-sm">
            আপনার একাউন্টে প্রবেশ করে গ্যাজেট কেনাবেচা শুরু করুন
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-gray-50/50">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full outline-none bg-transparent text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-gray-50/50">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none bg-transparent text-gray-800 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-white font-medium bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? (
              "লগইন হচ্ছে..."
            ) : (
              <>
                <LogIn size={18} />
                লগইন করুন
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          একাউন্ট নেই?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </motion.div>
    </section>
  );
}