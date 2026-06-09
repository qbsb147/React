import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
    //모든 사용자 조회
    getAllUsers : async() => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.ALL()
        )
        return response.data;
    },
    //기간 내 전체 이벤트 조회
    getEventsInDate : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.RANGE({startDate,endDate})
        )
        return response.data;
    },
    //기간 내 전체 사용자 조회
    getUsersInDate : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.ACCESS({startDate,endDate})
        )
        return response.data;
    },
    //사용자 조회
    getUser : async(user_no) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.GET(user_no)
        )
        return response.data;
    }
}