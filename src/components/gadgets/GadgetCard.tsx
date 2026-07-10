"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export interface Gadget {
  _id: string;
  title: string;
  category: string;
  price: number;
  condition: "new" | "used" | "refurbished";
  images: string[];
  location: string;
}

const conditionColor: Record<string, string> = {
  new: "bg-teal-500/90 text-white",
  used: "bg-amber-500/90 text-white",
  refurbished: "bg-blue-500/90 text-white",
};

export default function GadgetCard({ gadget }: { gadget: Gadget }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group h-full flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/60"
    >
      <Link href={`/gadgets/${gadget._id}`} className="flex h-full flex-col">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gadget.images[0] || "/images/placeholder.png"}
            alt={gadget.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* subtle bottom gradient for text legibility / premium feel */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          <span
            className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize backdrop-blur-sm shadow-sm ${conditionColor[gadget.condition]}`}
          >
            {gadget.condition}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900">
            {gadget.title}
          </h3>

          <p className="flex items-baseline gap-0.5 text-lg font-bold text-blue-600">
            <span className="text-sm font-semibold">৳</span>
            {gadget.price.toLocaleString()}
          </p>

          <div className="mt-auto flex items-center gap-1 pt-1 text-xs text-gray-500">
            <MapPin size={12} className="shrink-0" />
            <span className="line-clamp-1">{gadget.location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}