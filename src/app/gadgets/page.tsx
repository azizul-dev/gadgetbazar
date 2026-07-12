"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import GadgetCard, { Gadget } from "@/components/gadgets/GadgetCard";
import GadgetCardSkeleton from "@/components/gadgets/GadgetCardSkeleton";
import SearchBar from "@/components/gadgets/SearchBar";
import FilterSidebar, { Filters } from "@/components/gadgets/FilterSidebar";
import Pagination from "@/components/gadgets/Pagination";

const EMPTY_FILTERS: Filters = { category: "", condition: "", minPrice: "", maxPrice: "" };
const DEFAULT_SORT = "-createdAt";

function GadgetsPageInner() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchGadgets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      params.set("sort", sort);
      if (search) params.set("search", search);
      if (filters.category) params.set("category", filters.category);
      if (filters.condition) params.set("condition", filters.condition);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

      const res = await fetch(`/api/gadgets?${params.toString()}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "গ্যাজেট লোড করা যায়নি");
        setGadgets([]);
        return;
      }

      setGadgets(json.data);
      setTotalPages(json.pagination.totalPages);
      setTotal(json.pagination.total);
    } catch {
      setError("সার্ভারের সাথে সংযোগ করা যায়নি");
      setGadgets([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters, sort]);

  useEffect(() => {
    fetchGadgets();
  }, [fetchGadgets]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, sort]);

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">গ্যাজেট এক্সপ্লোর করুন</h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "লোড হচ্ছে..." : `${total.toLocaleString()} টি গ্যাজেট পাওয়া গেছে`}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <SearchBar defaultValue={search} onSearch={setSearch} />
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm lg:hidden"
        >
          <SlidersHorizontal size={16} />
          ফিল্টার
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sort={sort}
          onSortChange={setSort}
        />

        <div>
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!error && loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <GadgetCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !loading && gadgets.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <PackageSearch size={40} className="mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">কোনো গ্যাজেট পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-gray-400">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
            </div>
          )}

          {!error && !loading && gadgets.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {gadgets.map((gadget) => (
                  <GadgetCard key={gadget._id} gadget={gadget} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GadgetsPage() {
  return (
    <Suspense fallback={null}>
      <GadgetsPageInner />
    </Suspense>
  );
}
