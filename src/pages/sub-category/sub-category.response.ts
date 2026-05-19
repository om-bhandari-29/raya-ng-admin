export interface IItemGroup {
  id: number;
  name: string;
  is_group: boolean;
  image: string | null;
  gst_hsn_code: string | null;
  parent_item_group_id: number | null;
  is_active: boolean;
  liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface ISubCategory {
  id: number;
  name: string;
  item_group_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  item_group: IItemGroup;
}
