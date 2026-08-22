export interface RAllowedMetal {
  metal_type: number;
  // metal_master?: string;
  allowed_metal_purities_id: Array<{
    metal_purity_id: number;
    metal_purity_name: string;
    purity_code: string;
    percentage: number;
    rate_per_gram_inr: number;
    rate_per_gram_usd: number;
  }>;
}


export interface RMetalWeightMatrix {
  ring_size: number | null;
  base_metal_weight_gm: number | null;
}