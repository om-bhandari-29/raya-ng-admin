export interface IArchetype {
  id: number;
  design_slug: string;
  variant_name: string;
  target_gender: string;
}

export interface IArchetypeListResponse {
  items: IArchetype[];
}

export interface IMetalPurity {
  metal_purity: string;
  metal_color: string;
}

export interface IAllowedMetal {
  metal_purity: string;
  allowed_colors: string[];
}

export interface ISaveMetalPurity {
  metal_master_id: string;
  allowed_metal_purities_id: string[];
}

export interface ISizeQuantityMatrix {
  ring_size: string;
  stone_quantity: number;
  metal_weight: number | undefined;
}

export interface IZoneSlot {
  zone_slot_id: number;
  shape_normalized: string;
  dim_l_mm: string;
  dim_w_mm: string;
  is_dynamic_by_size: boolean;
  size_wt_matrix: ISizeQuantityMatrix[];
  fixed_quantity: number | null;
}

export interface IWeightMatrixEntry {
  ring_size: string;
  base_metal_weight_gm: number;
}

export interface IArchetypeVariant {
  variantId: number;
  variant: string;
  gender: string;
  allowed_metals: IMetalPurity[];
  zone_slots: {
    ZONE_CENTER: IZoneSlot[];
    ZONE_SHANK: IZoneSlot[];
    ZONE_HALO: IZoneSlot[];
    ZONE_ACCENT: IZoneSlot[];
    ZONE_GALLERY: IZoneSlot[];
  };
  design_variant_allowed_metals: Array<IAllowedMetal>;
  weight_matrix?: IWeightMatrixEntry[];
}

export interface IArchetypeDetail {
  design_slug: string;
  variants: IArchetypeVariant[];
}

export interface IArchetypeDetailResponse {
  success: boolean;
  data: IArchetypeDetail;
}

export interface IStoneOption {
  id: number;
  Stone_name: string;
  Estimated_Weight_Final_ct: number;
  Price_per_ct_INR: number;
  Price_per_ct_USD: number;
}
