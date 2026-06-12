import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const eventService = {
    //기간 내 전체 이벤트 조회
    getEventsInDate : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.RANGE({startDate,endDate})
        )
        return response.data;
    },
    //페이지 내로 데이터 조회
    getLoadEvent : async({page, size, sort}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.PAGE({page, size, sort})
        )
        return response.data;
    }
}