import { CarMake } from "@/lib/types";

export const CAR_MAKES: CarMake[] = [
  {
    id: "toyota",
    name: "Toyota",
    models: [
      { id: "gr86-2022", name: "GR86", year: 2022, makeId: "toyota" },
      { id: "gr86-2023", name: "GR86", year: 2023, makeId: "toyota" },
      { id: "supra-2021", name: "GR Supra", year: 2021, makeId: "toyota" },
      { id: "supra-2023", name: "GR Supra", year: 2023, makeId: "toyota" },
      { id: "86-2017", name: "86", year: 2017, makeId: "toyota" },
    ],
  },
  {
    id: "subaru",
    name: "Subaru",
    models: [
      { id: "brz-2022", name: "BRZ", year: 2022, makeId: "subaru" },
      { id: "brz-2023", name: "BRZ", year: 2023, makeId: "subaru" },
      { id: "wrx-2022", name: "WRX", year: 2022, makeId: "subaru" },
      { id: "wrx-sti-2021", name: "WRX STI", year: 2021, makeId: "subaru" },
    ],
  },
  {
    id: "honda",
    name: "Honda",
    models: [
      { id: "civic-si-2022", name: "Civic Si", year: 2022, makeId: "honda" },
      { id: "civic-type-r-2023", name: "Civic Type R", year: 2023, makeId: "honda" },
      { id: "s2000-2008", name: "S2000", year: 2008, makeId: "honda" },
    ],
  },
  {
    id: "nissan",
    name: "Nissan",
    models: [
      { id: "z-2023", name: "Z", year: 2023, makeId: "nissan" },
      { id: "370z-2020", name: "370Z", year: 2020, makeId: "nissan" },
      { id: "gtr-2020", name: "GT-R", year: 2020, makeId: "nissan" },
      { id: "silvia-s15", name: "Silvia S15", year: 2002, makeId: "nissan" },
    ],
  },
  {
    id: "mazda",
    name: "Mazda",
    models: [
      { id: "mx5-2023", name: "MX-5 Miata", year: 2023, makeId: "mazda" },
      { id: "rx7-1997", name: "RX-7", year: 1997, makeId: "mazda" },
      { id: "rx8-2008", name: "RX-8", year: 2008, makeId: "mazda" },
    ],
  },
  {
    id: "bmw",
    name: "BMW",
    models: [
      { id: "m3-2022", name: "M3", year: 2022, makeId: "bmw" },
      { id: "m4-2023", name: "M4", year: 2023, makeId: "bmw" },
      { id: "m2-2023", name: "M2", year: 2023, makeId: "bmw" },
      { id: "e46-m3", name: "E46 M3", year: 2003, makeId: "bmw" },
    ],
  },
  {
    id: "ford",
    name: "Ford",
    models: [
      { id: "mustang-gt-2023", name: "Mustang GT", year: 2023, makeId: "ford" },
      { id: "mustang-gt500-2022", name: "Shelby GT500", year: 2022, makeId: "ford" },
      { id: "focus-rs-2018", name: "Focus RS", year: 2018, makeId: "ford" },
    ],
  },
];
