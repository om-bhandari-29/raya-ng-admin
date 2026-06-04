export interface IProductMasterImported {
  id: number;
  design_slug: string;
  variant_name: string;
  target_gender: string;
}

export interface IProductMasterImportedResponse {
  success: boolean;
  count: number;
  data: IProductMasterImported[];
}
