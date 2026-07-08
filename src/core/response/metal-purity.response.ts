export interface RMetal {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface RMetalPurity {
  id: number;
  name: string;
  purity: string;
  percentage: number;
  rate_per_gram_inr: number;
  rate_per_gram_usd: number;
  created_at: string;
  updated_at: string;
}
