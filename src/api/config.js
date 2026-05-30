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
};
