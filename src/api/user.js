import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
    //KPI 영역
    //기간 내 전체 이벤트 조회
    getEvents : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.RANGE({startDate,endDate})
        )
        return response.data;
    },
    //기간 내 전체 사용자 조회
    getUsers : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.ACCESS({startDate,endDate})
        )
        return response.data;
    },
    //이벤트 타입별 조회
    getEventType : async({startDate, endDate, type}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.TYPE({startDate,endDate,type})
        )
        return response.data;
    }
}