import Link from "next/link";
import { CAR_MAKES } from "@/lib/data/cars";
import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";

export default function Home() {
  const totalModels = CAR_MAKES.reduce((s, m) => s + m.models.length, 0);
  const totalSubcats = CUSTOMIZATION_CATEGORIES.reduce((s, c) => s + c.subcategories.length, 0);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="pt-8 text-center">
        <h1 className="text-5xl font-black tracking-tight text-white">
          Kustom<span className="text-orange-500">Lab</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Plan your build. Track your budget. Find the cheapest parts — automatically.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/planner"
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Start Planning
          </Link>
          <Link
            href="/parts"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Browse Parts
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Car Makes", value: CAR_MAKES.length },
          { label: "Car Models", value: totalModels },
          { label: "Mod Categories", value: CUSTOMIZATION_CATEGORIES.length },
          { label: "Part Types", value: totalSubcats },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center"
          >
            <p className="text-3xl font-black text-orange-500">{value}</p>
            <p className="mt-1 text-sm text-zinc-400">{label}</p>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: "🛠️",
            title: "Build Planner",
            desc: "Choose your car, select mod areas, and pick exactly what you want to change.",
            href: "/planner",
          },
          {
            icon: "💰",
            title: "Live Price Scraper",
            desc: "Prices are fetched from Amazon, eBay, RockAuto, and more in real time.",
            href: "/parts",
          },
          {
            icon: "📊",
            title: "Budget Tracker",
            desc: "Set a total budget, allocate per category, and track spend vs plan.",
            href: "/budget",
          },
        ].map(({ icon, title, desc, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-orange-500/40 hover:bg-zinc-800"
          >
            <span className="text-3xl">{icon}</span>
            <h3 className="mt-3 font-bold text-white group-hover:text-orange-400">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{desc}</p>
          </Link>
        ))}
      </section>

      {/* Supported cars preview */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white">Supported Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {CAR_MAKES.flatMap((make) =>
            make.models.map((model) => (
              <span
                key={model.id}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
              >
                {model.year} {make.name} {model.name}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
