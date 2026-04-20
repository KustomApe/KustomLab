"use client";

import { useCallback, useEffect, useState } from "react";
import { PricedPart } from "@/lib/types";
import { usePlanStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, ExternalLink, TrendingDown } from "lucide-react";
import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";

type FetchState = "idle" | "loading" | "done" | "error";

export default function PartsTable() {
  const { car, make, customizations } = usePlanStore();
  const [parts, setParts] = useState<PricedPart[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [scrapedAt, setScrapedAt] = useState<string | null>(null);

  const allSubcategories = customizations.flatMap((c) => c.subcategoryIds);

  const fetchParts = useCallback(async () => {
    if (!car || allSubcategories.length === 0) return;
    setState("loading");
    try {
      const fitment = `${car.year} ${make?.name} ${car.name}`;
      const url = `/api/parts/search?subcategories=${allSubcategories.join(",")}&fitment=${encodeURIComponent(fitment)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setParts(data.parts);
      setScrapedAt(data.scrapedAt);
      setState("done");
    } catch {
      setState("error");
    }
  }, [car, make, allSubcategories.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  if (!car) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="py-12 text-center text-zinc-500">
          Select a car and customization areas to see parts & prices.
        </CardContent>
      </Card>
    );
  }

  if (allSubcategories.length === 0) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="py-12 text-center text-zinc-500">
          Pick at least one customization subcategory to search for parts.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">
            Parts & Prices —{" "}
            <span className="text-orange-400">
              {car.year} {make?.name} {car.name}
            </span>
          </CardTitle>
          {scrapedAt && (
            <p className="mt-1 text-xs text-zinc-500">
              Last scraped: {new Date(scrapedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchParts}
          disabled={state === "loading"}
          className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
          {state === "loading" ? "Scraping…" : "Refresh prices"}
        </button>
      </CardHeader>

      <CardContent className="space-y-6">
        {state === "loading" && (
          <div className="flex items-center justify-center gap-3 py-12 text-zinc-400">
            <RefreshCw className="h-5 w-5 animate-spin text-orange-500" />
            <span>Fetching latest prices from retailers…</span>
          </div>
        )}

        {state === "error" && (
          <p className="py-6 text-center text-red-400">Failed to fetch prices. Try refreshing.</p>
        )}

        {state === "done" &&
          CUSTOMIZATION_CATEGORIES.filter((cat) =>
            customizations.some((c) => c.categoryId === cat.id && c.subcategoryIds.length > 0)
          ).map((cat) => {
            const catParts = parts.filter((p) => p.category === cat.id);
            if (catParts.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                </div>
                <div className="space-y-3">
                  {catParts.map((part) => (
                    <PartRow key={part.id} part={part} />
                  ))}
                </div>
                <Separator className="mt-6 bg-zinc-800" />
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}

function PartRow({ part }: { part: PricedPart }) {
  const [expanded, setExpanded] = useState(false);
  const cheapest = part.sources[0];
  const totalCheapest = cheapest.price + cheapest.shipping;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-white">{part.name}</p>
          <p className="text-xs text-zinc-500">{part.fitment}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="font-bold">${totalCheapest.toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-500">best price @ {cheapest.store}</p>
          </div>
          <a
            href={cheapest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Buy
          </a>
        </div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
      >
        {expanded ? "Hide" : `View all ${part.sources.length} sources`}
      </button>

      {expanded && (
        <div className="mt-3 space-y-1.5">
          {part.sources.map((src, i) => (
            <div
              key={src.store}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm odd:bg-zinc-800"
            >
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <Badge className="border-green-500/40 bg-green-500/10 text-green-400 text-xs">
                    Best
                  </Badge>
                )}
                <span className="text-zinc-300">{src.store}</span>
                {!src.inStock && (
                  <Badge variant="outline" className="border-red-800 text-red-400 text-xs">
                    Out of stock
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-400 text-xs">
                  ${src.price.toFixed(2)} + ${src.shipping.toFixed(2)} ship
                </span>
                <span className="font-semibold text-white">
                  ${(src.price + src.shipping).toFixed(2)}
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-orange-400"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
