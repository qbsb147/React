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
    USER: `/data/user`,
    SHOP: `/data/shop`,
  },
};
