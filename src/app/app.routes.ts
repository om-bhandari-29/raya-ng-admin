import { Routes } from '@angular/router';
import { APPRoutes } from '../core/constant/app-routes';
import { Layout } from '../core/component/layout/layout';
import { StoneMasterType, StoneMasterLabel } from '../core/enum/stone-master.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APPRoutes.DASHBOARD,
    pathMatch: 'full',
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
        path: APPRoutes.SUB_CATEGORY,
        loadComponent: () =>
          import('../pages/sub-category/sub-category-list/sub-category-list').then(
            (m) => m.SubCategoryList,
          ),
      },
      {
        path: APPRoutes.PRODUCT_MASTER,
        loadComponent: () =>
          import('../pages/product-master/product-master-list/product-master-list').then(
            (m) => m.ProductMasterList,
          ),
      },
      {
        path: APPRoutes.PRODUCT_MASTER_UPSERT,
        loadComponent: () =>
          import('../pages/product-master/product-master-upsert/product-master-upsert').then(
            (m) => m.ProductMasterUpsert,
          ),
      },
      {
        path: APPRoutes.PRODUCT_MASTER_IMPORTED,
        loadComponent: () =>
          import('../pages/product-master-imported/product-master-imported-list/product-master-imported-list').then(
            (m) => m.ProductMasterImportedList,
          ),
      },
      {
        path: `${APPRoutes.PRODUCT_MASTER_IMPORTED_DETAIL}/:design_slug`,
        loadComponent: () =>
          import(
            '../pages/product-master-imported/product-master-imported-detail/product-master-imported-detail.component'
          ).then((m) => m.ProductMasterImportedDetailComponent),
      },
      {
        path: APPRoutes.GST_HSN_CODE,
        loadComponent: () =>
          import('../pages/gst-hsn-code/gst-hsn-code-list/gst-hsn-code-list').then(
            (m) => m.GstHsnCodeList,
          ),
      },
      {
        path: `${APPRoutes.GST_HSN_CODE}/upsert`,
        loadComponent: () =>
          import('../pages/gst-hsn-code/gst-hsn-code-upsert/gst-hsn-code-upsert').then(
            (m) => m.GstHsnCodeUpsert,
          ),
      },
      {
        path: APPRoutes.UOM,
        loadComponent: () => import('../pages/uom/uom-list/uom-list').then((m) => m.UomList),
      },
      {
        path: APPRoutes.ITEM_ATTRIBUTE,
        loadComponent: () =>
          import('../pages/item-attribute/item-attribute-list/item-attribute-list').then(
            (m) => m.ItemAttributeList,
          ),
      },
      {
        path: `${APPRoutes.ITEM_ATTRIBUTE}/upsert`,
        loadComponent: () =>
          import('../pages/item-attribute/item-attribute-upsert/item-attribute-upsert').then(
            (m) => m.ItemAttributeUpsert,
          ),
      },
      {
        path: APPRoutes.STONE_FAMILY,
        loadComponent: () =>
          import('../pages/stone-master/stone-master-list/stone-master-list').then(
            (m) => m.StoneMasterList,
          ),
        data: { stoneType: StoneMasterType.FAMILY, typeLabel: StoneMasterLabel.FAMILY },
      },
      {
        path: APPRoutes.STONE_CLARITY,
        loadComponent: () =>
          import('../pages/stone-master/stone-master-list/stone-master-list').then(
            (m) => m.StoneMasterList,
          ),
        data: { stoneType: StoneMasterType.CLARITY, typeLabel: StoneMasterLabel.CLARITY },
      },
      {
        path: APPRoutes.STONE_SHAPE,
        loadComponent: () =>
          import('../pages/stone-master/stone-master-list/stone-master-list').then(
            (m) => m.StoneMasterList,
          ),
        data: { stoneType: StoneMasterType.SHAPE, typeLabel: StoneMasterLabel.SHAPE },
      },
      {
        path: APPRoutes.STONE_DIMENSION,
        loadComponent: () =>
          import('../pages/stone-dimension/stone-dimension-list/stone-dimension-list').then(
            (m) => m.StoneDimensionList,
          ),
      },
      {
        path: APPRoutes.ARCHETYPES,
        loadComponent: () =>
          import('../pages/archetypes/archetypes-list/archetypes-list').then(
            (m) => m.ArchetypesList,
          ),
      },
      {
        path: `${APPRoutes.STONE_DIMENSION}/upsert`,
        loadComponent: () =>
          import('../pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert').then(
            (m) => m.StoneDimensionUpsert,
          ),
      },
      {
        path: APPRoutes.STOCK.ROOT,
        loadComponent: () => import('../pages/stock/stock').then((m) => m.Stock),
      },
      {
        path: 'stock/item',
        loadComponent: () => import('../pages/item/item-list/item-list').then((m) => m.ItemList),
      },
      {
        path: 'stock/item/upsert',
        loadComponent: () =>
          import('../pages/item/item-upsert/item-upsert').then((m) => m.ItemUpsert),
      },
      {
        path: 'stock/item-group',
        loadComponent: () =>
          import('../pages/group-item/group-item-list/group-item-list').then(
            (m) => m.GroupItemList,
          ),
      },
      {
        path: 'stock/item-group/upsert',
        loadComponent: () =>
          import('../pages/group-item/group-item-upsert/group-item-upsert').then(
            (m) => m.GroupItemUpsert,
          ),
      },
    ],
  },
];
