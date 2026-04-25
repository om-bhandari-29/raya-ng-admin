import { Routes } from '@angular/router';
import { APPRoutes } from '../core/constant/app-routes';
import { Layout } from '../core/component/layout/layout';

export const routes: Routes = [
    {
        path: '',
        redirectTo: APPRoutes.DASHBOARD,
        pathMatch: 'full'
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: APPRoutes.DASHBOARD,
                loadComponent: () => import('./../pages/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: APPRoutes.ITEM_GROUP,
                loadComponent: () => import('../pages/group-item/group-item-list/group-item-list').then((m) => m.GroupItemList),
            },
            {
                path: APPRoutes.SUB_CATEGORY,
                loadComponent: () => import('../pages/sub-category/sub-category-list/sub-category-list').then((m) => m.SubCategoryList),
            },
            {
                path: APPRoutes.PRODUCT_MASTER,
                loadComponent: () => import('../pages/product-master/product-master-list/product-master-list').then((m) => m.ProductMasterList),
            },
            {
                path: APPRoutes.GST_HSN_CODE,
                loadComponent: () => import('../pages/gst-hsn-code/gst-hsn-code-list/gst-hsn-code-list').then((m) => m.GstHsnCodeList),
            },
            {
                path: APPRoutes.UOM,
                loadComponent: () => import('../pages/uom/uom-list/uom-list').then((m) => m.UomList),
            },
        ]
    },
];
