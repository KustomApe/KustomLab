"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CarMake, CarModel, SelectedCustomization } from "@/lib/types";

type PlanStore = {
  make: CarMake | null;
  car: CarModel | null;
  customizations: SelectedCustomization[];
  totalBudget: number;

  setMake: (make: CarMake | null) => void;
  setCar: (car: CarModel | null) => void;
  setTotalBudget: (budget: number) => void;
  addCustomization: (categoryId: string) => void;
  removeCustomization: (categoryId: string) => void;
  toggleSubcategory: (categoryId: string, subcategoryId: string) => void;
  setCategoryBudget: (categoryId: string, budget: number) => void;
  resetPlan: () => void;
};

export const usePlanStore = create<PlanStore>()(
  persist(
    (set) => ({
      make: null,
      car: null,
      customizations: [],
      totalBudget: 5000,

      setMake: (make) => set({ make, car: null }),
      setCar: (car) => set({ car }),
      setTotalBudget: (totalBudget) => set({ totalBudget }),

      addCustomization: (categoryId) =>
        set((s) => {
          if (s.customizations.find((c) => c.categoryId === categoryId)) return s;
          return {
            customizations: [
              ...s.customizations,
              { categoryId, subcategoryIds: [], budget: 0 },
            ],
          };
        }),

      removeCustomization: (categoryId) =>
        set((s) => ({
          customizations: s.customizations.filter((c) => c.categoryId !== categoryId),
        })),

      toggleSubcategory: (categoryId, subcategoryId) =>
        set((s) => ({
          customizations: s.customizations.map((c) => {
            if (c.categoryId !== categoryId) return c;
            const has = c.subcategoryIds.includes(subcategoryId);
            return {
              ...c,
              subcategoryIds: has
                ? c.subcategoryIds.filter((id) => id !== subcategoryId)
                : [...c.subcategoryIds, subcategoryId],
            };
          }),
        })),

      setCategoryBudget: (categoryId, budget) =>
        set((s) => ({
          customizations: s.customizations.map((c) =>
            c.categoryId === categoryId ? { ...c, budget } : c
          ),
        })),

      resetPlan: () =>
        set({ make: null, car: null, customizations: [], totalBudget: 5000 }),
    }),
    { name: "kustomlab-plan" }
  )
);
