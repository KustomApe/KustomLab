"use client";

import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";
import { usePlanStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CustomizationSelector() {
  const { customizations, addCustomization, removeCustomization, toggleSubcategory } =
    usePlanStore();

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Step 2 — Choose Customization Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CUSTOMIZATION_CATEGORIES.map((cat) => {
          const selected = customizations.find((c) => c.categoryId === cat.id);
          const isActive = !!selected;

          return (
            <div
              key={cat.id}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                isActive
                  ? "border-orange-500/50 bg-orange-500/5"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              )}
            >
              <button
                onClick={() =>
                  isActive ? removeCustomization(cat.id) : addCustomization(cat.id)
                }
                className="flex w-full items-center gap-2 text-left"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className={cn("text-sm font-semibold", isActive ? "text-orange-400" : "text-white")}>
                    {cat.name}
                  </p>
                  <p className="text-xs text-zinc-500">{cat.description}</p>
                </div>
              </button>

              {isActive && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => {
                    const checked = selected.subcategoryIds.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => toggleSubcategory(cat.id, sub.id)}
                        className="focus:outline-none"
                      >
                        <Badge
                          variant={checked ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer text-xs transition-colors",
                            checked
                              ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
                              : "border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-white"
                          )}
                        >
                          {sub.name}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
