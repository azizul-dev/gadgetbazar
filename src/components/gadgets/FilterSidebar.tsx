"use client";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

export interface Filters {
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
}

const CATEGORIES = [
  { value: "", label: "সব ক্যাটাগরি" },
  { value: "phone", label: "ফোন" },
  { value: "laptop", label: "ল্যাপটপ" },
  { value: "camera", label: "ক্যামেরা" },
  { value: "audio", label: "অডিও" },
  { value: "gaming", label: "গেমিং" },
  { value: "other", label: "অন্যান্য" },
];

const CONDITIONS = [
  { value: "", label: "সব অবস্থা" },
  { value: "new", label: "নতুন" },
  { value: "used", label: "ব্যবহৃত" },
  { value: "refurbished", label: "রিফার্বিশড" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "নতুন আগে" },
  { value: "createdAt", label: "পুরাতন আগে" },
  { value: "price", label: "কম দাম আগে" },
  { value: "-price", label: "বেশি দাম আগে" },
];

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function FilterSidebar({
  filters,
  onChange,
  onClear,
  isOpen,
  onClose,
  sort,
  onSortChange,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.category || filters.condition || filters.minPrice || filters.maxPrice;

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white p-5 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-full lg:translate-x-0 lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">ফিল্টার</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button onClick={onClear} className="text-xs font-medium text-blue-600 hover:underline">
                রিসেট
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <ArrowUpDown size={13} />
            সাজান
          </h3>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            ক্যাটাগরি
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => update({ category: c.value })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filters.category === c.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            অবস্থা
          </h3>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => update({ condition: c.value })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filters.condition === c.value
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            মূল্য পরিসীমা (৳)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="সর্বনিম্ন"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min={0}
              placeholder="সর্বোচ্চ"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
