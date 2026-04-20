"use client";

import { usePlanStore } from "@/lib/store";
import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function BudgetPlanner() {
  const { customizations, totalBudget, setTotalBudget, setCategoryBudget } = usePlanStore();

  const allocatedTotal = customizations.reduce((sum, c) => sum + (c.budget || 0), 0);
  const remaining = totalBudget - allocatedTotal;
  const pct = totalBudget > 0 ? Math.min((allocatedTotal / totalBudget) * 100, 100) : 0;

  if (customizations.length === 0) return null;

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Step 3 — Set Your Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Total budget */}
        <div className="flex items-center gap-4">
          <label className="min-w-[120px] text-sm text-zinc-300">Total Budget</label>
          <div className="relative flex-1 max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
            <Input
              type="number"
              min={0}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="border-zinc-700 bg-zinc-800 pl-7 text-white"
            />
          </div>
          <span className={`text-sm font-semibold ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
            {remaining < 0 ? "-" : ""}${Math.abs(remaining).toLocaleString()} {remaining < 0 ? "over" : "remaining"}
          </span>
        </div>

        {/* Per-category allocation */}
        <div className="space-y-3">
          {customizations.map((c) => {
            const cat = CUSTOMIZATION_CATEGORIES.find((x) => x.id === c.categoryId);
            if (!cat) return null;
            return (
              <div key={c.categoryId} className="flex items-center gap-4">
                <span className="text-lg">{cat.icon}</span>
                <span className="min-w-[140px] text-sm text-zinc-300">{cat.name}</span>
                <div className="relative max-w-[180px] flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                  <Input
                    type="number"
                    min={0}
                    value={c.budget}
                    onChange={(e) => setCategoryBudget(c.categoryId, Number(e.target.value))}
                    className="border-zinc-700 bg-zinc-800 pl-7 text-white"
                  />
                </div>
                {c.budget > 0 && (
                  <span className="text-xs text-zinc-500">
                    {totalBudget > 0 ? Math.round((c.budget / totalBudget) * 100) : 0}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <Progress
            value={pct}
            className={`h-2 ${pct >= 100 ? "[&>div]:bg-red-500" : "[&>div]:bg-orange-500"}`}
          />
          <p className="text-right text-xs text-zinc-500">
            ${allocatedTotal.toLocaleString()} / ${totalBudget.toLocaleString()} allocated
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
