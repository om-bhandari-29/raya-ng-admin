import { StoneMasterType } from '../../core/enum/stone-master.enum';

export interface IStoneMaster {
  id: number;
  name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export { StoneMasterType };
