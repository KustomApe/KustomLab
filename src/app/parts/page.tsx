"use client";

import PartsTable from "@/components/PartsTable";
import { usePlanStore } from "@/lib/store";
import Link from "next/link";

export default function PartsPage() {
  const { car, make, customizations } = usePlanStore();
  const allSubcategories = customizations.flatMap((c) => c.subcategoryIds);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Parts & Prices</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {car
              ? `Showing parts for ${car.year} ${make?.name} ${car.name} — ${allSubcategories.length} part type(s) selected`
              : "No car selected yet. Set up your plan first."}
          </p>
        </div>
        <Link
          href="/planner"
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          ← Edit Plan
        </Link>
      </div>

      <PartsTable />
    </div>
  );
}
