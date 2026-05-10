export interface IGroupItem {
  id: number;
  name_frappe_based_id: string;
  is_group: boolean;
  image: string | null;
  gst_hsn_code: string | null;
  parent_item_group: string | null;
  is_active: boolean;
  liked: boolean;
  created_at: string;
  updated_at: string;
}
