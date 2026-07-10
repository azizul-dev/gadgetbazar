"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import GadgetCard, { Gadget } from "@/components/gadgets/GadgetCard";

const dummyGadgets: Gadget[] = [
  {
    _id: "1",
    title: "iPhone 13 Pro 128GB",
    category: "phone",
    price: 65000,
    condition: "used",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    ],
    location: "Dhaka",
  },
  {
    _id: "2",
    title: "MacBook Air M1 2020",
    category: "laptop",
    price: 85000,
    condition: "refurbished",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    ],
    location: "Chattogram",
  },
  {
    _id: "3",
    title: "Canon EOS 200D",
    category: "camera",
    price: 42000,
    condition: "used",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    ],
    location: "Sylhet",
  },
  {
    _id: "4",
    title: "Sony WH-1000XM4",
    category: "audio",
    price: 22000,
    condition: "new",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    ],
    location: "Dhaka",
  },
];

export default function FeaturedGadgets() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      {/* Blur Orbs */}
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
            >
              <Sparkles size={16} />
              Featured Collection
            </motion.div>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Featured Gadgets
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              The most popular, trending, and newly listed gadgets from
              across Bangladesh, all in one place.
            </p>
          </div>

          <Link href="/gadgets">
            <Button
              radius="full"
              size="lg"
              className="group bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-7 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-blue-400/40"
            >
              <span className="flex items-center gap-2">
                Explore All
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-10 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <TrendingUp size={18} className="text-green-500" />
            <span className="font-medium text-gray-700">
              Trending Products
            </span>
          </div>

          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">
              100% Verified Listings
            </span>
          </div>

          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">
              Fast &amp; Secure
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {dummyGadgets.map((gadget, index) => (
            <motion.div
              key={gadget._id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                y: -10,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group flex h-full"
            >
              <div className="flex h-full w-full rounded-3xl bg-white/70 p-[2px] shadow-lg backdrop-blur-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-300/30">
                <div className="flex h-full w-full flex-col rounded-3xl bg-white">
                  <GadgetCard gadget={gadget} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900">
            Looking for more gadgets?
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Browse hundreds of verified gadgets from trusted sellers across
            Bangladesh.
          </p>

          <Link href="/gadgets">
            <Button
              size="lg"
              radius="full"
              className="mt-8 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-10 font-semibold text-white shadow-xl hover:scale-105"
            >
              Browse Marketplace
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}