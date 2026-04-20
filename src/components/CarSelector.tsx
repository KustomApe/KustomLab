"use client";

import { CAR_MAKES } from "@/lib/data/cars";
import { usePlanStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CarSelector() {
  const { make, car, setMake, setCar } = usePlanStore();

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Step 1 — Select Your Car
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Select
            value={make?.id ?? ""}
            onValueChange={(id) => {
              const found = CAR_MAKES.find((m) => m.id === id) ?? null;
              setMake(found);
            }}
          >
            <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
              <SelectValue placeholder="Choose make…" />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              {CAR_MAKES.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-white focus:bg-zinc-700">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={car?.id ?? ""}
            disabled={!make}
            onValueChange={(id) => {
              const found = make?.models.find((m) => m.id === id) ?? null;
              setCar(found);
            }}
          >
            <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white disabled:opacity-40">
              <SelectValue placeholder={make ? "Choose model…" : "Select make first"} />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              {make?.models.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-white focus:bg-zinc-700">
                  {m.year} {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
