import axios from 'axios';
import { API_CONFIG, IMG_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const fileApi = axios.create({
  baseURL: `${IMG_CONFIG.IMG_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          console.error(data?.message || '인증 에러가 발생했습니다.');
          break;
        case 403:
          console.error(data?.message || '접근권한이 없습니다.');
          break;
        case 404:
          console.error(data?.message || '요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error(data?.message || '서버 에러 발생');
          break;
        default:
          console.error(data?.message || 'API 에러 :', data);
      }
    } else if (error.request) {
      console.error('네트워크 에러 : ', error.request);
    } else {
      console.error('에러 :', error.message);
    }

    return Promise.reject(error)
  }
);
export default api;
export {fileApi}
