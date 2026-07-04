export const APIRoutes = {
  item_group: {
    GET_ALL: '/item-group',
    GET_BY_ID: (id: number | string) => `/item-group/${id}`,
    CREATE: '/item-group',
    UPDATE: (id: number | string) => `/item-group/${id}`,
    DELETE: (id: number | string) => `/item-group/${id}`,
    COMBO: '/item-group/combo',
    TOGGLE_LIKED: '/item-group/toggle-liked',
  },
  sub_category: {
    GET_ALL: '/sub-category',
    GET_BY_ID: (id: number | string) => `/sub-category/${id}`,
    CREATE: '/sub-category',
    UPDATE: (id: number | string) => `/sub-category/${id}`,
    DELETE: (id: number | string) => `/sub-category/${id}`,
    COMBO: (item_group_id: string | null) =>
      item_group_id
        ? `/sub-category/combo?item_group_name=${item_group_id}`
        : '/sub-category/combo',
  },
  product_master: {
    GET_ALL: '/product-master',
    GET_BY_NAME: (name: string) => `/product-master/${name}`,
    CREATE: '/product-master',
    UPDATE: (id: number | string) => `/product-master/${id}`,
    DELETE: (id: number | string) => `/product-master/${id}`,
    COMBO: (sub_category_id?: number) =>
      sub_category_id
        ? `/product-master/combo?sub_category_id=${sub_category_id}`
        : '/product-master/combo',
  },
  gst_hsn_code: {
    GET_ALL: (page: number = 1, limit: number = 20) => `/gst-hsn-code?page=${page}&limit=${limit}`,
    GET_BY_ID: (id: number | string) => `/gst-hsn-code/${id}`,
    CREATE: '/gst-hsn-code',
    UPDATE: (id: number | string) => `/gst-hsn-code/${id}`,
    DELETE: (id: number | string) => `/gst-hsn-code/${id}`,
    COMBO: '/gst-hsn-code/combo',
  },
  uom: {
    GET_ALL: '/uom',
    GET_BY_ID: (id: number | string) => `/uom/${id}`,
    CREATE: '/uom',
    UPDATE: (id: number | string) => `/uom/${id}`,
    DELETE: (id: number | string) => `/uom/${id}`,
    COMBO: '/uom/combo',
  },
  item: {
    GET_ALL: '/item',
    GET_BY_ID: (id: number) => `/item/${id}`,
    GET_BY_NAME: (name: string) => `/item/by-name/${name}`,
    CREATE: '/item',
    UPDATE: (id: number | string) => `/item/${id}`,
    DELETE: (id: number | string) => `/item/${id}`,
  },
  item_attribute: {
    GET_ALL: '/item-attribute-master',
    GET_BY_ID: (id: number | string) => `/item-attribute-master/${id}`,
    CREATE: '/item-attribute-master',
    UPDATE: (id: number | string) => `/item-attribute-master/${id}`,
    DELETE: (id: number | string) => `/item-attribute-master/${id}`,
    COMBO: '/item-attribute-master/combo',
  },
  stone_family: {
    GET_ALL: (page: number = 1, limit: number = 20, search: string = '') =>
      `/stone-master/type?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    GET_BY_ID: (id: number | string) => `/stone-master/type/${id}`,
    CREATE: '/stone-master/type',
    UPDATE: (id: number | string) => `/stone-master/type/${id}`,
    DELETE: (id: number | string) => `/stone-master/type/${id}`,
    COMBO: '/stone-master/type/combo',
  },
  stone_clarity: {
    GET_ALL: (page: number = 1, limit: number = 20, search: string = '') =>
      `/stone-master/clarity?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    GET_BY_ID: (id: number | string) => `/stone-master/clarity/${id}`,
    CREATE: '/stone-master/clarity',
    UPDATE: (id: number | string) => `/stone-master/clarity/${id}`,
    DELETE: (id: number | string) => `/stone-master/clarity/${id}`,
    COMBO: '/stone-master/clarity/combo',
  },
  stone_shape: {
    GET_ALL: (page: number = 1, limit: number = 20, search: string = '') =>
      `/stone-master/shape?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    GET_BY_ID: (id: number | string) => `/stone-master/shape/${id}`,
    CREATE: '/stone-master/shape',
    UPDATE: (id: number | string) => `/stone-master/shape/${id}`,
    DELETE: (id: number | string) => `/stone-master/shape/${id}`,
    COMBO: '/stone-master/shape/combo',
  },
  stone_dimension: {
    GET_ALL: (page: number = 1, limit: number = 10, search: string = '') =>
      `/stone?page=${page}&limit=${limit}${search ? `&generatedKey=${encodeURIComponent(search)}` : ''}`,
    GET_BY_ID: (id: number | string) => `/stone/${id}`,
    CREATE: '/stone',
    UPDATE: (id: number | string) => `/stone/${id}`,
    DELETE: (id: number | string) => `/stone/${id}`,
    COMBO: '/stone/combo',
    OPTION: '/stone/option',
  },
  archetypes: {
    GET_ALL: '/products/archetypes',
    GET_DETAIL: (design_Id: number) => `/products/detail/${design_Id}`,
  },

  products_import: {
    GET_BlUEPRINT: '/products-import/blueprints',
    DETAIL: (design_slug: string) => `/products-import/detail/${design_slug}`,
    CALCULATE_PRICE: '/products-import/calculate-price',
    GET_VARIANT: (design_slug: string) => `/products/variants/${design_slug}`,
    GET_ZONE_ALLOWEDMTL: (variantId: number) => `/products/variant/${variantId}`,
    GET_ALLOWED_METALS: (variantId: number | string) =>
      `/products/variant/${variantId}/allowed-metals`,
    UPDATE_VARIANT_ALLOWED_METALS: '/products/variant/allowed-metals',
    POST: '/products/variant',
    POST_BULK_VARIANT_UNDER_DESIGN: '/products/bulk-variants',
  },

  Blueprint_Zone_Config: {
    UPDATE: '/blueprint-zones/config',
    POST_STONE_CONFIG: '/blueprint-zones/config',
  },

  Metal_Purity: {
    CREATE: '/metal-purity',
    GET_ALL: '/metal-purity',
    GET_COMBO: '/metal-purity/combo',
    GET_BY_ID: (id: number | string) => `/metal-purity/${id}`,
    UPDATE: (id: number | string) => `/metal-purity/${id}`,
    DELETE: (id: number | string) => `/metal-purity/${id}`,
    GET_BY_VARIANT_ID: (variantId: number | string) => `/metal-purity/variant/${variantId}`,
  },

  Metal_Color: {
    CREATE: '/metal-color',
    GET_ALL: '/metal-color',
    GET_COMBO: '/metal-color/combo',
    GET_BY_ID: (id: number | string) => `/metal-color/${id}`,
    UPDATE: (id: number | string) => `/metal-color/${id}`,
    DELETE: (id: number | string) => `/metal-color/${id}`,

    // GET_BY_ID: '/metal-color/:id',
    // UPDATE: '/metal-color/:id',
    // DELETE: '/metal-color/:id',
  },
};
