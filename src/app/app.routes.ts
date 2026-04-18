import { Routes } from '@angular/router';
import { APPRoutes } from '../core/constant/app-routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: APPRoutes.DASHBOARD,
        pathMatch: 'full'
    },
    {
        path: APPRoutes.DASHBOARD,
        loadComponent: () => import('./../pages/dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
        path: APPRoutes.ITEM_GROUP,
        loadComponent: () => import('./../pages/group-item/group-item').then((m) => m.GroupItem),
    },
];
