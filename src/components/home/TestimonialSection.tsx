"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, BadgeCheck, Loader2 } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTestimonials(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

      {/* Blur Orbs */}
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Customer Stories
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Trusted by
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Thousands of Users
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover why buyers and sellers across Bangladesh trust our
            marketplace for secure, fast, and hassle-free gadget trading.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -12,
                scale: 1.02,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.15,
              }}
              className="group relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-sky-500/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

              <div className="relative h-full rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-500 group-hover:shadow-2xl">
                {/* Quote */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white shadow-lg">
                  <Quote size={24} />
                </div>

                {/* Rating */}
                <div className="mb-6 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={18}
                      className={
                        idx < item.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-[15px] leading-8 text-gray-600">
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* User */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-lg font-bold text-white shadow-lg">
                    {item.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <BadgeCheck size={15} className="text-emerald-500" />
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-xl backdrop-blur-xl">
            <div className="grid gap-10 text-center md:grid-cols-3">
              <div>
                <h3 className="text-4xl font-black text-blue-600">
                  {testimonials.length}+
                </h3>
                <p className="mt-2 text-gray-600">Happy Customers</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-blue-600">
                  {(
                    testimonials.reduce((sum, t) => sum + t.rating, 0) /
                    testimonials.length
                  ).toFixed(1)}
                  ★
                </h3>
                <p className="mt-2 text-gray-600">Average User Rating</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-blue-600">98%</h3>
                <p className="mt-2 text-gray-600">Successful Transactions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}