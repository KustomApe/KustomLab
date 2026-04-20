/**
 * Mock price scraping service.
 * Architecture is ready to be replaced with real scrapers (Puppeteer, Playwright, or Django API calls).
 *
 * Each "source" simulates fetching from a real retailer.
 * Prices fluctuate slightly on each call to simulate live scraping.
 */

import { PricedPart, PriceSource } from "@/lib/types";

const STORES = [
  { name: "Amazon", baseShipping: 0, ratingBonus: 0 },
  { name: "eBay", baseShipping: 12, ratingBonus: -0.5 },
  { name: "RockAuto", baseShipping: 15, ratingBonus: 0 },
  { name: "TireRack", baseShipping: 18, ratingBonus: 1 },
  { name: "Enjuku Racing", baseShipping: 10, ratingBonus: 0.5 },
  { name: "Mishimoto", baseShipping: 0, ratingBonus: 0.5 },
  { name: "Cusco", baseShipping: 20, ratingBonus: 1 },
  { name: "Konig Wheels", baseShipping: 25, ratingBonus: 0.5 },
];

type PartTemplate = {
  name: string;
  category: string;
  subcategory: string;
  basePrice: number;
  priceVariance: number; // % variance across stores
};

const PART_TEMPLATES: Record<string, PartTemplate[]> = {
  intake: [
    { name: "Injen SP Cold Air Intake", category: "engine", subcategory: "intake", basePrice: 299, priceVariance: 0.15 },
    { name: "K&N 69-Series Typhoon CAI", category: "engine", subcategory: "intake", basePrice: 349, priceVariance: 0.1 },
    { name: "AEM 21-Series Cold Air Intake", category: "engine", subcategory: "intake", basePrice: 279, priceVariance: 0.12 },
  ],
  exhaust: [
    { name: "MagnaFlow 3in Cat-Back Exhaust", category: "engine", subcategory: "exhaust", basePrice: 799, priceVariance: 0.08 },
    { name: "Borla ATAK Cat-Back System", category: "engine", subcategory: "exhaust", basePrice: 1199, priceVariance: 0.06 },
    { name: "HKS Hi-Power Exhaust", category: "engine", subcategory: "exhaust", basePrice: 950, priceVariance: 0.1 },
    { name: "Tomei Expreme Ti Catback", category: "engine", subcategory: "exhaust", basePrice: 1450, priceVariance: 0.05 },
  ],
  header: [
    { name: "Skunk2 Racing Headers 4-2-1", category: "engine", subcategory: "header", basePrice: 449, priceVariance: 0.12 },
    { name: "Greddy 4-2-1 Equal Length Header", category: "engine", subcategory: "header", basePrice: 699, priceVariance: 0.08 },
  ],
  turbo: [
    { name: "Garrett G25-660 Turbocharger", category: "engine", subcategory: "turbo", basePrice: 1499, priceVariance: 0.05 },
    { name: "Borg Warner EFR 7163 Turbo", category: "engine", subcategory: "turbo", basePrice: 2199, priceVariance: 0.04 },
  ],
  intercooler: [
    { name: "Mishimoto Performance Intercooler", category: "engine", subcategory: "intercooler", basePrice: 599, priceVariance: 0.1 },
    { name: "HKS Intercooler Kit", category: "engine", subcategory: "intercooler", basePrice: 899, priceVariance: 0.08 },
  ],
  tune: [
    { name: "Cobb Accessport V3", category: "engine", subcategory: "tune", basePrice: 699, priceVariance: 0.05 },
    { name: "ECUTEK RaceROM Tuning", category: "engine", subcategory: "tune", basePrice: 499, priceVariance: 0.03 },
  ],
  clutch: [
    { name: "ACT Xtreme Street Clutch Kit", category: "engine", subcategory: "clutch", basePrice: 649, priceVariance: 0.1 },
    { name: "Clutch Masters FX350 Kit", category: "engine", subcategory: "clutch", basePrice: 549, priceVariance: 0.12 },
    { name: "Exedy Stage 2 Clutch Kit", category: "engine", subcategory: "clutch", basePrice: 499, priceVariance: 0.1 },
  ],
  coilovers: [
    { name: "Tein Flex Z Coilovers", category: "suspension", subcategory: "coilovers", basePrice: 699, priceVariance: 0.1 },
    { name: "BC Racing BR-Series Coilovers", category: "suspension", subcategory: "coilovers", basePrice: 999, priceVariance: 0.08 },
    { name: "Öhlins Road & Track Coilovers", category: "suspension", subcategory: "coilovers", basePrice: 2499, priceVariance: 0.04 },
    { name: "KW Variant 3 Coilovers", category: "suspension", subcategory: "coilovers", basePrice: 2199, priceVariance: 0.05 },
  ],
  springs: [
    { name: "Tein S.Tech Lowering Springs", category: "suspension", subcategory: "springs", basePrice: 199, priceVariance: 0.12 },
    { name: "H&R Sport Lowering Springs", category: "suspension", subcategory: "springs", basePrice: 249, priceVariance: 0.1 },
  ],
  "sway-bars": [
    { name: "Whiteline Front Sway Bar Kit", category: "suspension", subcategory: "sway-bars", basePrice: 349, priceVariance: 0.1 },
    { name: "Cusco Front Sway Bar 24mm", category: "suspension", subcategory: "sway-bars", basePrice: 299, priceVariance: 0.12 },
  ],
  "strut-bar": [
    { name: "Cusco Power Brace Front Strut Bar", category: "suspension", subcategory: "strut-bar", basePrice: 249, priceVariance: 0.12 },
    { name: "Raceseng Clubman Strut Bar", category: "suspension", subcategory: "strut-bar", basePrice: 329, priceVariance: 0.08 },
  ],
  pads: [
    { name: "Hawk HPS Performance Pads (Front)", category: "brakes", subcategory: "pads", basePrice: 89, priceVariance: 0.15 },
    { name: "EBC Yellowstuff Brake Pads", category: "brakes", subcategory: "pads", basePrice: 119, priceVariance: 0.12 },
    { name: "StopTech Sport Brake Pads", category: "brakes", subcategory: "pads", basePrice: 99, priceVariance: 0.14 },
  ],
  rotors: [
    { name: "Brembo UV Coated Rotors (pair)", category: "brakes", subcategory: "rotors", basePrice: 179, priceVariance: 0.12 },
    { name: "StopTech Slotted Rotors (pair)", category: "brakes", subcategory: "rotors", basePrice: 219, priceVariance: 0.1 },
  ],
  bbk: [
    { name: "Brembo GT 6-Piston BBK Front", category: "brakes", subcategory: "bbk", basePrice: 2999, priceVariance: 0.04 },
    { name: "StopTech Trophy Sport BBK", category: "brakes", subcategory: "bbk", basePrice: 2499, priceVariance: 0.05 },
  ],
  "wheels-set": [
    { name: "Enkei RPF1 17x9 Set of 4", category: "wheels", subcategory: "wheels-set", basePrice: 1099, priceVariance: 0.08 },
    { name: "Volk TE37 17x9 Set of 4", category: "wheels", subcategory: "wheels-set", basePrice: 2999, priceVariance: 0.04 },
    { name: "Konig Hypergram 18x8.5 Set of 4", category: "wheels", subcategory: "wheels-set", basePrice: 799, priceVariance: 0.1 },
    { name: "OZ Racing Ultraleggera Set of 4", category: "wheels", subcategory: "wheels-set", basePrice: 1899, priceVariance: 0.06 },
  ],
  tires: [
    { name: "Michelin Pilot Sport 4S (set)", category: "wheels", subcategory: "tires", basePrice: 1199, priceVariance: 0.08 },
    { name: "Bridgestone Potenza S007 (set)", category: "wheels", subcategory: "tires", basePrice: 999, priceVariance: 0.1 },
    { name: "Continental ExtremeContact Sport (set)", category: "wheels", subcategory: "tires", basePrice: 799, priceVariance: 0.12 },
  ],
  "front-bumper": [
    { name: "Varis Arising-1 Front Bumper", category: "exterior", subcategory: "front-bumper", basePrice: 1299, priceVariance: 0.06 },
    { name: "TRD Front Splitter", category: "exterior", subcategory: "front-bumper", basePrice: 699, priceVariance: 0.08 },
  ],
  "rear-diffuser": [
    { name: "Voltex Rear Diffuser", category: "exterior", subcategory: "rear-diffuser", basePrice: 849, priceVariance: 0.08 },
    { name: "OEM+ Style Rear Diffuser", category: "exterior", subcategory: "rear-diffuser", basePrice: 399, priceVariance: 0.12 },
  ],
  "wing-spoiler": [
    { name: "Voltex Type 7 GT Wing", category: "exterior", subcategory: "wing-spoiler", basePrice: 1899, priceVariance: 0.06 },
    { name: "TRD GR86 GT Spoiler", category: "exterior", subcategory: "wing-spoiler", basePrice: 599, priceVariance: 0.1 },
  ],
  seats: [
    { name: "Recaro Pole Position Seat", category: "interior", subcategory: "seats", basePrice: 1499, priceVariance: 0.06 },
    { name: "Bride ZETA III Sport Seat", category: "interior", subcategory: "seats", basePrice: 1799, priceVariance: 0.05 },
    { name: "Sparco Rev Seat", category: "interior", subcategory: "seats", basePrice: 699, priceVariance: 0.1 },
  ],
  harness: [
    { name: "Takata 4-Point Drift Harness", category: "interior", subcategory: "harness", basePrice: 199, priceVariance: 0.12 },
    { name: "Schroth Profi II 4-Point Harness", category: "interior", subcategory: "harness", basePrice: 299, priceVariance: 0.1 },
  ],
  "steering-wheel": [
    { name: "MOMO Heritage 350mm Wheel", category: "interior", subcategory: "steering-wheel", basePrice: 299, priceVariance: 0.12 },
    { name: "NRG 350mm Leather Wheel", category: "interior", subcategory: "steering-wheel", basePrice: 199, priceVariance: 0.15 },
  ],
  "head-unit": [
    { name: "Pioneer DMH-WT87NEX 9in Apple CarPlay", category: "audio", subcategory: "head-unit", basePrice: 499, priceVariance: 0.1 },
    { name: "Sony XAV-AX8050D 8.95in Head Unit", category: "audio", subcategory: "head-unit", basePrice: 599, priceVariance: 0.09 },
  ],
  radiator: [
    { name: "Mishimoto Performance Aluminum Radiator", category: "cooling", subcategory: "radiator", basePrice: 449, priceVariance: 0.1 },
    { name: "Koyo Aluminum Radiator", category: "cooling", subcategory: "radiator", basePrice: 399, priceVariance: 0.12 },
  ],
};

function jitter(base: number, variance: number): number {
  const factor = 1 + (Math.random() * variance * 2 - variance);
  return Math.round(base * factor * 100) / 100;
}

export function scrapeParts(subcategoryId: string, fitment: string): PricedPart[] {
  const templates = PART_TEMPLATES[subcategoryId];
  if (!templates) return [];

  return templates.map((tpl, idx) => {
    const numSources = 3 + Math.floor(Math.random() * 4); // 3-6 sources
    const shuffledStores = [...STORES].sort(() => Math.random() - 0.5).slice(0, numSources);

    const sources: PriceSource[] = shuffledStores.map((store) => ({
      store: store.name,
      url: `https://www.${store.name.toLowerCase().replace(/\s/g, "")}.com/search?q=${encodeURIComponent(tpl.name)}`,
      price: jitter(tpl.basePrice, tpl.priceVariance),
      inStock: Math.random() > 0.15,
      shipping: store.baseShipping > 0 ? jitter(store.baseShipping, 0.2) : 0,
      rating: Math.round((4 + Math.random() * 0.9 + store.ratingBonus) * 10) / 10,
    }));

    sources.sort((a, b) => a.price + a.shipping - (b.price + b.shipping));

    return {
      id: `${subcategoryId}-${idx}`,
      name: tpl.name,
      category: tpl.category,
      subcategory: tpl.subcategory,
      fitment,
      sources,
      lastScraped: new Date().toISOString(),
    };
  });
}

export function scrapeAllParts(subcategoryIds: string[], fitment: string): PricedPart[] {
  return subcategoryIds.flatMap((id) => scrapeParts(id, fitment));
}
