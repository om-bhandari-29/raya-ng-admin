export interface IGroupItem {
  id: number;
  name: string;
  is_group: boolean;
  image: string | null;
  gst_hsn_code: string | null;
  parent_item_group_id: string | null;
  parent_item_group_name: string | null;
  is_active: boolean;
  liked: boolean;
  created_at: string;
  updated_at: string;
}
