"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Search, ArrowRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    router.push(
      trimmed ? `/gadgets?search=${encodeURIComponent(trimmed)}` : "/gadgets"
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-teal-50/40">
      {/* Animated glow blobs */}
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-200 rounded-full blur-[110px] opacity-30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.span
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200"
        >
          Bangladesh Most Trusted Gadget Marketplace
        </motion.span>

        <motion.h1
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
        >
          Give Your Old Gadgets
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
            A New Home
          </span>
        </motion.h1>

        <motion.p
          custom={0.25}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Phones, laptops, cameras, or headphones — sell safely or buy at the
          best price. A marketplace trusted by thousands of users.
        </motion.p>

        {/* Search bar */}
        <motion.div
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 max-w-xl mx-auto flex gap-2 bg-white rounded-full shadow-xl p-2 border border-gray-100"
        >
          <div className="flex items-center flex-1 px-3">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for any gadget..."
              className="w-full px-2 py-2 outline-none text-gray-700 bg-transparent"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="rounded-full px-6 text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition-opacity border-0"
          >
            <span className="inline-flex items-center justify-center">
              Search
            </span>
          </Button>
        </motion.div>

        <motion.div
          custom={0.55}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8"
        >
          <Link href="/gadgets" className="inline-block w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 text-white bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500 hover:opacity-90 transition-opacity border-0"
            >
              <span className="inline-flex items-center justify-center gap-2">
                Explore All Gadgets
                <ArrowRight size={18} />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
