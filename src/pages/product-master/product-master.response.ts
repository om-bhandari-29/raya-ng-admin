export interface ISubCategory {
  id: number;
  name: string;
  item_group_id: number;
  is_active: boolean;
}

export interface IProductMaster {
  id: number;
  name: string;
  sub_category_id: number;
  labour_rate: string;
  labour_rate_on: string;
  product_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sub_category: ISubCategory;
}
