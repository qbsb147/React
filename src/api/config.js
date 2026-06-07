const { VITE_API_URL, VITE_API_TIMEOUT, VITE_API_VERSION } = import.meta.env;

export const API_CONFIG = {
  BASE_URL: `${VITE_API_URL}`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const IMG_CONFIG = {
  IMG_URL: `${VITE_API_URL}`,
};

export const API_ENDPOINTS = {
  /*
  DATA : 대규모 데이터를 생성하는데 사용되는 API입니다.
  LAST_DOMAIN : 해당 도메인의 마지막 사용자(index)를 가져옵니다.
  DUMMY_DOMAIN : 
  - 해당 도메인으로 대규모 데이터를 생성합니다.
  - 해당 도메인으로부터 index 목록을 불러올 때도 사용합니다.
  */
  DATA: {
    LAST_USER: `/user?_sort=-user_no&_page=1&_per_page=1`,
    DUMMY_USER: `/user`,
    LAST_BOARD: `/board?_sort=-board_no&_page=1&_per_page=1`,
    DUMMY_BOARD: `/board`,
    LAST_EVENT: `/event?_sort=-event_no&_page=1&_per_page=1`,
    DUMMY_EVENT: `/event`,
    LAST_PRODUCT: `/product?_sort=-product_no&_page=1&_per_page=1`,
    DUMMY_PRODUCT: `/product`,
    LAST_SALES_RECORD: `/sale_record?_sort=-sales_no&_page=1&_per_page=1`,
    DUMMY_SALES_RECORD: `/sale_record`,
  },
  EVENT: {
    RANGE : ({startDate,endDate})         => `/event?_where={"and":[{"create_at":{"gt"${startDate}}},{"create_at":{"lt":${endDate}}}]}`,
    TYPE  : ({startDate, endDate, type})  => `/event?_where={"and":[{"create_at":{"gt"${startDate}}},{"create_at":{"lt":${endDate}}},{"type":{"eq":${type}}}]}`,
  },
  USER: {
    ACCESS:({startDate,endDate})          => `/user?_where={"and":[{"access_time":{"gt"${startDate}}},{"access_time":{"lt":${endDate}}}]}`
  }
};
