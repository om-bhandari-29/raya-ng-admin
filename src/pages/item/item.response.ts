import { ItemVariantRow } from "./item-upsert/tabs/variants-tab/variants-tab.model";

export interface IItemProductMaster {
  id: number;
  name: string;
}

export interface IItemGroup {
  id: number;
  name: string;
}

export interface IItemHsnSac {
  id: number;
  hsn_code: string;
}

export interface IItemUom {
  id: number;
  name: string;
}

export interface IItemBarcode {
  id: number;
  item_id: number;
  barcode: string;
  barcode_type: string | null;
  uom_id: number | null;
  uom: IItemUom | null;
}

export interface IItemVariantAttribute {
  id: number;
  attribute_name: string;
}

export interface IItemVariantValue {
  id: number;
  attribute_value: string;
  abbreviation: string | null;
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
  attribute: IItemVariantAttribute;
  value: IItemVariantValue;
  variant_of: IItem | null;
}

export interface IItemStoneMaster {
  id: number;
  name: string;
}

export interface IItemStoneDetail {
  id: number;
  item_id: number;
  stone_family_id: number;
  stone_clarity_id: number | null;
  stone_shape_id: number;
  weight_carat: string;
  stone_family: IItemStoneMaster;
  stone_clarity: IItemStoneMaster | null;
  stone_shape: IItemStoneMaster;
}

export interface IItem {
  id: number;
  product_master_id: number;
  name: string;
  item_group_id: number;
  hsn_sac_id: number | null;
  default_uom_id: number | null;
  fixed_qty: string;
  is_disabled: boolean;
  allow_alternative_item: boolean;
  maintain_stock: boolean;
  is_in_stock: boolean;
  has_variants: boolean;
  estimated_delivery_days: number;
  valuation_rate: string;
  is_fixed_asset: boolean;
  over_delivery_receipt_allowance: string;
  over_billing_allowance: string;
  description: string | null;
  shelf_life_in_days: number;
  warranty_period_in_days: number | null;
  end_of_life: string;
  weight_per_unit: string;
  weight_uom_id: number | null;
  default_material_request_type: string;
  valuation_method: string | null;
  allow_negative_stock: boolean;
  stones: string | null;
  gross_weight: string;
  net_weight: string;
  stones_weight_in_gram: string;
  stone_carat_wt: string;
  pure_weight_metal: string;
  labor_rate: string;
  created_at: string;
  updated_at: string;
  // Relations
  product_master: IItemProductMaster | null;
  item_group: IItemGroup | null;
  hsn_sac: IItemHsnSac | null;
  default_uom: IItemUom | null;
  weight_uom: IItemUom | null;
  barcodes: IItemBarcode[];
  variants: ItemVariantRow[];
  stone_details: IItemStoneDetail[];
}
