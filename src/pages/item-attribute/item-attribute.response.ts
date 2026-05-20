export interface IItemAttributeValue {
  id: number;
  attribute_master_id: number;
  name: string;
  type: string | null;
  abbreviation: string | null;
  purity_factor: number;
}

export interface IItemAttribute {
  id: number;
  name: string;
  status: boolean;
  is_base_attribute: boolean;
  numeric_values: boolean;
  from_range: string;
  to_range: string;
  increment: string;
  values: IItemAttributeValue[];
  created_at: string;
  updated_at: string;
}
