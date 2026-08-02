export interface RMetal {
  id: number;
  name: string;
}
export interface RMetalPurity {
  id: number;
  name: string;
  purity: string;
  purity_code: string;
  percentage: number;
  rate_per_gram_inr: number;
  rate_per_gram_usd: number;
  density_multiplier: number | null;
  created_at: string;
  updated_at: string;
}
