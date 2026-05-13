export interface ISubCategory {
  id: number;
  name: string;
  item_group_name: string;
  is_active: boolean;
}

export interface IProductMaster {
  id: number;
  name: string;
  sub_category_name: number;
  product_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sub_category: ISubCategory;
}
