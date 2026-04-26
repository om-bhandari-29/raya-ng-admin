import { IGroupItem } from '../group-item/group-item.response';
import { IProductMaster } from '../product-master/product-master.response';
import { IUom } from '../uom/uom.response';
import { IGstHsnCode } from '../gst-hsn-code/gst-hsn-code.response';
import { IItemAttribute } from '../item-attribute/item-attribute.response';
import { IStoneMaster } from '../stone-master/stone-master.response';

export interface ItemDropdowns {
  itemGroups: IGroupItem[];
  productMasters: IProductMaster[];
  uoms: IUom[];
  hsnCodes: IGstHsnCode[];
  itemAttributes: IItemAttribute[];
  stoneFamilies: IStoneMaster[];
  stoneClarities: IStoneMaster[];
  stoneShapes: IStoneMaster[];
}

export enum MaterialRequestType {
  PURCHASE = 'Purchase',
  MATERIAL_TRANSFER = 'Material Transfer',
  MATERIAL_ISSUE = 'Material Issue',
  MANUFACTURE = 'Manufacture',
  CUSTOMER_PROVIDED = 'Customer Provided',
}

export enum ValuationMethod {
  FIFO = 'FIFO',
  MOVING_AVERAGE = 'Moving Average',
  LIFO = 'LIFO',
}

export enum BarcodeType {
  EAN = 'EAN',
  UPC_A = 'UPC-A',
  CODE_39 = 'CODE-39',
  ISBN = 'ISBN',
}
