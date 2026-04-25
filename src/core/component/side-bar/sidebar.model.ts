import { SafeHtml } from "@angular/platform-browser";
import { APPRoutes } from "../../constant/app-routes";
// import 'boxicons'

export interface IMenuItem {
    name: string;
    route: string;
    icon: string | SafeHtml;
    userType: string[];
}
export interface IMenuSideBarItem extends IMenuItem {
    child: IMenuItem[],
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
        name: 'Item Group',
        route: APPRoutes.ITEM_GROUP,
        icon: 'bx bx-category',
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
]
