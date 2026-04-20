"use client";

import { usePlanStore } from "@/lib/store";
import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function BudgetPage() {
  const { car, make, customizations, totalBudget } = usePlanStore();

  const allocated = customizations.reduce((s, c) => s + (c.budget || 0), 0);
  const remaining = totalBudget - allocated;
  const overBudget = remaining < 0;

  if (!car || customizations.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-white">Budget Tracker</h1>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No plan set up yet.</p>
            <Link
              href="/planner"
              className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Go to Planner
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Budget Tracker</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {car.year} {make?.name} {car.name}
        </p>
      </div>

      {/* Summary card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Total Budget</p>
            <p className="mt-1 text-3xl font-black text-white">${totalBudget.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Allocated</p>
            <p className="mt-1 text-3xl font-black text-orange-400">${allocated.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className={`border-zinc-800 ${overBudget ? "bg-red-950/30" : "bg-zinc-900"}`}>
          <CardContent className="pt-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {overBudget ? "Over Budget" : "Remaining"}
            </p>
            <p className={`mt-1 text-3xl font-black ${overBudget ? "text-red-400" : "text-green-400"}`}>
              {overBudget ? "-" : ""}${Math.abs(remaining).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall progress */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="pt-5">
          <div className="mb-2 flex justify-between text-sm text-zinc-400">
            <span>Overall allocation</span>
            <span>{totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0}%</span>
          </div>
          <Progress
            value={totalBudget > 0 ? Math.min((allocated / totalBudget) * 100, 100) : 0}
            className={`h-3 ${overBudget ? "[&>div]:bg-red-500" : "[&>div]:bg-orange-500"}`}
          />
        </CardContent>
      </Card>

      {/* Per-category breakdown */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customizations.map((c, i) => {
            const cat = CUSTOMIZATION_CATEGORIES.find((x) => x.id === c.categoryId);
            if (!cat) return null;
            const pct = totalBudget > 0 ? Math.min(((c.budget || 0) / totalBudget) * 100, 100) : 0;
            return (
              <div key={c.categoryId}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium text-white">{cat.name}</span>
                    {c.subcategoryIds.length > 0 && (
                      <span className="text-xs text-zinc-500">
                        ({c.subcategoryIds.length} item{c.subcategoryIds.length > 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-white">
                    ${(c.budget || 0).toLocaleString()}
                  </span>
                </div>
                <Progress value={pct} className="h-1.5 [&>div]:bg-orange-500" />
                {i < customizations.length - 1 && <Separator className="mt-4 bg-zinc-800" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link
          href="/planner"
          className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
        >
          ← Edit Plan
        </Link>
        <Link
          href="/parts"
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Find Parts →
        </Link>
      </div>
    </div>
  );
}
