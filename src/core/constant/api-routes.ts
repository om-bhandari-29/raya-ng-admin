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
  }
};
