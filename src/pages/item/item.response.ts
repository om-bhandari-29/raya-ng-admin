import { MaterialRequestType, ValuationMethod } from './item.models';

export interface IItemBarcode {
  id: number;
  item_id: number;
  barcode: string;
  barcode_type: string | null;
  uom_id: number | null;
}

export interface IItemVariant {
  id: number;
  item_id: number;
  variant_of_id: number | null;
  attribute_id: number;
  value_id: number;
  is_disabled: boolean;
  stone_family: string | null;
  stone_id: string | null;
}

export interface IItemStoneDetail {
  id: number;
  item_id: number;
  stone_family_id: number;
  stone_clarity_id: number | null;
  stone_shape_id: number;
  weight_carat: number;
}

export interface IItem {
  id: number;
  product_master_id: number;
  name: string;
  item_group_id: number;
  hsn_sac_id: number | null;
  default_uom_id: number | null;
  fixed_qty: number;
  is_disabled: boolean;
  allow_alternative_item: boolean;
  maintain_stock: boolean;
  is_in_stock: boolean;
  has_variants: boolean;
  estimated_delivery_days: number;
  valuation_rate: number;
  is_fixed_asset: boolean;
  over_delivery_receipt_allowance: number;
  over_billing_allowance: number;
  description: string | null;
  // Inventory
  shelf_life_in_days: number;
  warranty_period_in_days: number | null;
  end_of_life: string;
  weight_per_unit: number;
  weight_uom_id: number | null;
  default_material_request_type: MaterialRequestType;
  valuation_method: ValuationMethod | null;
  allow_negative_stock: boolean;
  // Variants
  stones: string | null;
  gross_weight: number;
  net_weight: number;
  stones_weight_in_gram: number;
  stone_carat_wt: number;
  pure_weight_metal: number;
  labor_rate: number;
  // Relations
  barcodes: IItemBarcode[];
  variants: IItemVariant[];
  stone_details: IItemStoneDetail[];
  created_at: string;
  updated_at: string;
}
