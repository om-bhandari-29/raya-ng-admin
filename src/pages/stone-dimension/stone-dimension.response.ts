export interface IStoneDimension {
  id: number;
  shape: string;
  stoneName: string;
  cutStyle: string;
  origin?: string;
  clarity?: string;
  colour?: string;
  stoneType: string;
  cutGrade?: string;
  countryOrigin?: string;
  enhancementTreatment?: string;
  sourceFile?: string;
  sizeRange?: string;
  length?: number;
  width?: number;
  height?: number;
  estimatedWeightInCt?: number;
  pricePerCt?: number;
  pricePerCtUsd?: number;
  generatedKey: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IStoneDimensionListResponse {
  stones: IStoneDimension[];
  pagination: IPagination;
}
