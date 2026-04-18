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
        icon: 'bx bxs-dashboard', // already correct ✅
        userType: [],
        child: [],
    },
    {
        name: 'Item Group',
        route: APPRoutes.ITEM_GROUP,
        icon: 'bx bx-category', // best fit 👍 (represents grouping/categories)
        userType: [],
        child: [],
    },
    // {
    //     name: 'Customers',
    //     route: AppRoutes.CUSTOMER,
    //     icon: 'bx bx-user',
    //     userType: [],
    //     child: [],
    // },
    // {
    //     name: 'Collection/Category',
    //     route: AppRoutes.COLLECTION,
    //     icon: 'bx bxs-store-alt',
    //     userType: [],
    //     child: [],
    // },
    // //   {
    // //     name: 'Category',
    // //     route: AppRoutes.CATEGORY,
    // //     icon: 'bx bx-layer',
    // //     userType: [],
    // //     child: [],
    // // },
    // {
    //     name: 'Banner',
    //     route: AppRoutes.BANNER,
    //     icon: 'bx bx-receipt',
    //     userType: [],
    //     child: [],
    // },
    // {
    //     name: 'Product',
    //     route: AppRoutes.PRODUCT,
    //     icon: 'bx bxs-package',
    //     userType: [],
    //     child: [],
    // },
    // {
    //     name: 'Orders',
    //     route: AppRoutes.ORDERS,
    //     icon: 'bx bx-coin-stack',
    //     userType: [],
    //     child: [],
    // },

]