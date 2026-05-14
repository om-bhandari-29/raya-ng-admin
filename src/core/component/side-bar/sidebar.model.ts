import { SafeHtml } from '@angular/platform-browser';
import { APPRoutes } from '../../constant/app-routes';

export interface IMenuItem {
  name: string;
  route: string;
  icon: string | SafeHtml;
  userType: string[];
}
export interface IMenuSideBarItem extends IMenuItem {
  child: IMenuItem[];
  expanded?: boolean;
}

export const MenuItems: IMenuSideBarItem[] = [
  {
    name: 'Dashboard',
    route: APPRoutes.DASHBOARD,
    icon: 'bx bxs-dashboard',
    userType: [],
    child: [],
  },
  {
    name: 'Sub Category',
    route: APPRoutes.SUB_CATEGORY,
    icon: 'bx bx-list-ul',
    userType: [],
    child: [],
  },
  {
    name: 'Product Master',
    route: APPRoutes.PRODUCT_MASTER,
    icon: 'bx bx-package',
    userType: [],
    child: [],
  },
  {
    name: 'GST HSN Code',
    route: APPRoutes.GST_HSN_CODE,
    icon: 'bx bx-receipt',
    userType: [],
    child: [],
  },
  {
    name: 'UOM',
    route: APPRoutes.UOM,
    icon: 'bx bx-ruler',
    userType: [],
    child: [],
  },
  {
    name: 'Item Attribute',
    route: APPRoutes.ITEM_ATTRIBUTE,
    icon: 'bx bx-tag',
    userType: [],
    child: [],
  },
  {
    name: 'Stone Type',
    route: APPRoutes.STONE_FAMILY,
    icon: 'bx bx-diamond',
    userType: [],
    child: [],
  },
  {
    name: 'Stone Clarity',
    route: APPRoutes.STONE_CLARITY,
    icon: 'bx bx-search-alt',
    userType: [],
    child: [],
  },
  {
    name: 'Stone Shape',
    route: APPRoutes.STONE_SHAPE,
    icon: 'bx bx-shape-circle',
    userType: [],
    child: [],
  },
  {
    name: 'Stone Dimension',
    route: APPRoutes.STONE_DIMENSION,
    icon: 'bx bx-cube',
    userType: [],
    child: [],
  },
  {
    name: 'Stock',
    route: APPRoutes.STOCK.ROOT,
    icon: 'bx bx-store',
    userType: [],
    child: [],
  },
];
