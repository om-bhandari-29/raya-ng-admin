import { FormControl } from "@angular/forms";

export interface ItemVariantRow {
  id: number;
  variant_of_id: number | null;
  attribute_value: number | null;
  attribute_master_id: number | null;
  attribute_master_value: string;
  is_disabled: boolean;
  value: string | null;
  stone_id: string;
  stone_family: string;
}

export interface ItemVariantsPayload {
  stones: string;
  gross_weight: number;
  net_weight: number;
  stones_weight_in_gram: number;
  stone_carat_wt: number;
  pure_weight_metal: number;
  labor_rate: number;
  variants: {
    attribute_id: number;
    value_id: number;
    variant_of_id?: number;
    is_disabled?: boolean;
    stone_family?: string;
    stone_id?: string;
  }[];
}

export interface VariantWeightForm {
  gross_weight: FormControl<number>;
  net_weight: FormControl<number>;
  stones_weight_in_gram: FormControl<number>;
  stone_carat_wt: FormControl<number>;
  pure_weight_metal: FormControl<number>;
  labor_rate: FormControl<number>;
  stones: FormControl<string>;
}