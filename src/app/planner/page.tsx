"use client";

import CarSelector from "@/components/CarSelector";
import CustomizationSelector from "@/components/CustomizationSelector";
import BudgetPlanner from "@/components/BudgetPlanner";
import { usePlanStore } from "@/lib/store";
import Link from "next/link";

export default function PlannerPage() {
  const { car, customizations, resetPlan } = usePlanStore();
  const hasSelections = customizations.some((c) => c.subcategoryIds.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Build Planner</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Configure your car and pick the mods you want to do.
          </p>
        </div>
        <button
          onClick={resetPlan}
          className="text-sm text-zinc-500 underline-offset-2 hover:text-red-400 hover:underline"
        >
          Reset plan
        </button>
      </div>

      <CarSelector />
      <CustomizationSelector />
      <BudgetPlanner />

      {car && hasSelections && (
        <div className="flex justify-end gap-3">
          <Link
            href="/parts"
            className="rounded-lg bg-orange-500 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Find Parts & Prices →
          </Link>
        </div>
      )}
    </div>
  );
}
