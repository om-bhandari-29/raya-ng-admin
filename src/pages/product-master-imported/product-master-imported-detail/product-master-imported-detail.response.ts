export interface ISizeQuantityMatrix {
  ring_size: string;
  stone_quantity: number;
}

export interface IStoneZone {
  zone_slot_id: number;
  zone_name: string;
  template_id: string;
  is_dynamic_by_size: boolean;
  fixed_quantity: number | null;
  size_quantity_matrix: ISizeQuantityMatrix[] | null;
}

export interface IAllowedMetal {
  metal_purity: string;
  metal_color: string;
}

export interface IBlueprintVariant {
  variant: string;
  gender: string;
  allowed_metals: IAllowedMetal[];
  zone_slots: IStoneZone[];
}

export interface IBlueprintData {
  design_slug: string;
  variants: IBlueprintVariant[];
}
