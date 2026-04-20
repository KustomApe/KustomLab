export type CarMake = {
  id: string;
  name: string;
  models: CarModel[];
};

export type CarModel = {
  id: string;
  name: string;
  year: number;
  makeId: string;
};

export type CustomizationCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

export type SelectedCustomization = {
  categoryId: string;
  subcategoryIds: string[];
  budget: number;
};

export type PricedPart = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  fitment: string; // e.g. "2020-2023 Toyota GR86"
  sources: PriceSource[];
  lastScraped: string; // ISO date
};

export type PriceSource = {
  store: string;
  url: string;
  price: number;
  inStock: boolean;
  shipping: number;
  rating?: number;
};

export type PlanState = {
  car: CarModel | null;
  make: CarMake | null;
  customizations: SelectedCustomization[];
  totalBudget: number;
};
