export interface RAllowedMetal{
    metal_master_id: number;
    metal_master: string;
    allowed_metal_purities_id: Array<{
        metal_purity_id: number;
        metal_purity_name: string;
        rate_per_gram_inr: number;
        rate_per_gram_usd: number;
    }>
}