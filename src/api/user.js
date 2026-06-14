import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
    //모든 사용자 방문
    getUserCnt : async() => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.USER.COUNT()
        )
        return response.data.items;
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