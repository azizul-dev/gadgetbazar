"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  phone: "Phone",
  laptop: "Laptop",
  camera: "Camera",
  audio: "Audio",
  gaming: "Gaming",
  other: "Other",
};

const COLORS = ["#2563EB", "#0D9488", "#F59E0B", "#8B5CF6", "#EC4899", "#64748B"];

export default function CategoryChart() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gadgets/stats")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const chartData = Object.entries(res.data).map(([key, value]) => ({
            name: CATEGORY_LABELS[key] || key,
            count: value as number,
          }));
          setData(chartData);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis
            width={32}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 13,
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
