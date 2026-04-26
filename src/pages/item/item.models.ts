import { IComboItem, IComboHsnCode } from '../../core/response/combo.interface';
import { IItemAttribute } from '../item-attribute/item-attribute.response';

export interface ItemDropdowns {
  itemGroups: IComboItem[];
  productMasters: IComboItem[];
  uoms: IComboItem[];
  hsnCodes: IComboHsnCode[];
  itemAttributes: IItemAttribute[];
  stoneFamilies: IComboItem[];
  stoneClarities: IComboItem[];
  stoneShapes: IComboItem[];
}

// Matches backend MaterialRequestTypeEnum
export enum MaterialRequestType {
  PURCHASE = 'purchase',
  MATERIAL_TRANSFER = 'material_transfer',
  MATERIAL_ISSUE = 'material_issue',
  MANUFACTURE = 'manufacture',
  CUSTOMER_PROVIDED = 'customer_provided',
}

export const MaterialRequestTypeLabels: Record<MaterialRequestType, string> = {
  [MaterialRequestType.PURCHASE]: 'Purchase',
  [MaterialRequestType.MATERIAL_TRANSFER]: 'Material Transfer',
  [MaterialRequestType.MATERIAL_ISSUE]: 'Material Issue',
  [MaterialRequestType.MANUFACTURE]: 'Manufacture',
  [MaterialRequestType.CUSTOMER_PROVIDED]: 'Customer Provided',
};

// Matches backend ValuationMethodEnum
export enum ValuationMethod {
  FIFO = 'fifo',
  MOVING_AVERAGE = 'moving_average',
  LIFO = 'lifo',
}

export const ValuationMethodLabels: Record<ValuationMethod, string> = {
  [ValuationMethod.FIFO]: 'FIFO',
  [ValuationMethod.MOVING_AVERAGE]: 'Moving Average',
  [ValuationMethod.LIFO]: 'LIFO',
};

export enum BarcodeType {
  EAN = 'EAN',
  UPC_A = 'UPC-A',
  CODE_39 = 'CODE-39',
  ISBN = 'ISBN',
}
