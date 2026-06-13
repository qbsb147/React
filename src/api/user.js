import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
    //모든 사용자 방문
    getAllUsers : async() => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.ALL()
        )
        return response.data;
    },
    //기간 내 전체 이벤트 방문
    getEventsInDate : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.EVENT.RANGE({startDate,endDate})
        )
        return response.data;
    },
    //기간 내 전체 사용자 방문
    getUsersInDate : async({startDate, endDate}) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.ACCESS({startDate,endDate})
        )
        return response.data;
    },
    //사용자 방문
    getUser : async(user_no) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.GET(user_no)
        )
        return response.data[0];
    }
}