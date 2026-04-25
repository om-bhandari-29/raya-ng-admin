export interface IItemAttributeValue {
  id: number;
  attribute_id: number;
  attribute_value: string;
  attribute_type: string | null;
  abbreviation: string | null;
  purity_factor: number;
}

export interface IItemAttribute {
  id: number;
  attribute_name: string;
  status: boolean;
  is_base_attribute: boolean;
  numeric_values: boolean;
  values: IItemAttributeValue[];
  created_at: string;
  updated_at: string;
}
