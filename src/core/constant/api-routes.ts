export const APIRoutes = {
  item_group: {
    GET_ALL: '/item-group',
    GET_BY_ID: (id: number | string) => `/item-group/${id}`,
    CREATE: '/item-group',
    UPDATE: (id: number | string) => `/item-group/${id}`,
    DELETE: (id: number | string) => `/item-group/${id}`
  },
  sub_category: {
    GET_ALL: '/sub-category',
    GET_BY_ID: (id: number | string) => `/sub-category/${id}`,
    CREATE: '/sub-category',
    UPDATE: (id: number | string) => `/sub-category/${id}`,
    DELETE: (id: number | string) => `/sub-category/${id}`
  },
  product_master: {
    GET_ALL: '/product-master',
    GET_BY_ID: (id: number | string) => `/product-master/${id}`,
    CREATE: '/product-master',
    UPDATE: (id: number | string) => `/product-master/${id}`,
    DELETE: (id: number | string) => `/product-master/${id}`
  },
  gst_hsn_code: {
    GET_ALL: '/gst-hsn-code',
    GET_BY_ID: (id: number | string) => `/gst-hsn-code/${id}`,
    CREATE: '/gst-hsn-code',
    UPDATE: (id: number | string) => `/gst-hsn-code/${id}`,
    DELETE: (id: number | string) => `/gst-hsn-code/${id}`
  },
  uom: {
    GET_ALL: '/uom',
    GET_BY_ID: (id: number | string) => `/uom/${id}`,
    CREATE: '/uom',
    UPDATE: (id: number | string) => `/uom/${id}`,
    DELETE: (id: number | string) => `/uom/${id}`
  }
};
