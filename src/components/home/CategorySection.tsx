"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Gamepad2,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const categoryMeta = [
  {
    name: "Smartphones",
    value: "phone",
    icon: Smartphone,
    color: "from-blue-600 via-sky-500 to-cyan-500",
  },
  {
    name: "Laptops",
    value: "laptop",
    icon: Laptop,
    color: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    name: "Cameras",
    value: "camera",
    icon: Camera,
    color: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    name: "Audio",
    value: "audio",
    icon: Headphones,
    color: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    name: "Gaming",
    value: "gaming",
    icon: Gamepad2,
    color: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    name: "Accessories",
    value: "other",
    icon: Package,
    color: "from-cyan-500 via-blue-500 to-indigo-500",
  },
];

export default function CategorySection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/gadgets/stats");
        const data = await res.json();
        if (data.success) {
          setCounts(data.data);
        }
      } catch (error) {
        console.error("Category stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />

      {/* Blur */}
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
            Explore Categories
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Find Gadgets by
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Category
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Browse thousands of verified gadgets across popular categories and
            discover the perfect device for your needs.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
          {categoryMeta.map((category, index) => {
            const Icon = category.icon;
            const count = counts[category.value] ?? 0;

            return (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={`/gadgets?category=${category.value}`}
                  className="group relative block overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-7 shadow-lg backdrop-blur-xl transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-400/0 to-sky-500/0 opacity-0 transition duration-500 group-hover:from-blue-500/10 group-hover:via-cyan-400/10 group-hover:to-sky-500/10 group-hover:opacity-100" />

                  {/* Icon */}
                  <div
                    className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${category.color} text-white shadow-xl transition duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon size={34} />
                  </div>

                  {/* Count */}
                  <div className="relative mt-6 text-center">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {loading ? "..." : `${count} Items`}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="relative mt-5 text-center text-xl font-bold text-gray-900">
                    {category.name}
                  </h3>

                  {/* CTA */}
                  <div className="relative mt-5 flex items-center justify-center gap-2 font-semibold text-blue-600">
                    Explore

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
