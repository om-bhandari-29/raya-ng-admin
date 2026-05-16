export interface IItemGroup {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ISubCategory {
  id: number;
  name: string;
  item_group_name: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  item_group: IItemGroup;
}
