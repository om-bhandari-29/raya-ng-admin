export interface IArchetype {
  id: number;
  design_slug: string;
  variant_name: string;
  target_gender: string;
}

export interface IArchetypeListResponse {
  items: IArchetype[];
}
