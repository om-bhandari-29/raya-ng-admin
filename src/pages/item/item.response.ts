export interface IItem {
  id: number;
  product_master_id: number | null;
  item_name: string;
  item_group_id: number;
  hsn_sac: string;
  default_uom_id: number;
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
