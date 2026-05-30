import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';
export const dataService = {
    getUserLastIndex : async() => {
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.LAST_USER)
        return response.data?.data[0] ? response.data.data[0].user_no : 1;
    },
    generateDummyUser : async() => {
        const response = await axiosInstance.post(API_ENDPOINTS.DATA)
        return response.data?.data[0] ? response.data.data[0].user_no : 1;
    },
    getUserIndexList : async(payload)=>{
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.DUMMY_USER, payload);
        const data = response.data;
        let list = [];
        data.forEach(element => {
            list.push(element.user_no)
        });
        return list;
    },
    getBoardLastIndex : async() => {
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.LAST_BOARD)
        return response.data?.data[0] ? response.data.data[0].board_no : 1;
    },
    generateDummyBoard : async(payload)=>{
        const response = await axiosInstance.post(API_ENDPOINTS.DATA.DUMMY_BOARD, payload)
        return response.data;
    },
    getBoardIndexList : async(payload)=>{
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.DUMMY_BOARD, payload);
        const data = response.data;
        let list = [];
        data.forEach(element => {
            list.push(element.board_no)
        });
        return list;
    },
    getEventLastIndex : async() => {
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.LAST_EVENT)
        return response.data?.data[0] ? response.data.data[0].event_no : 1;
    },
    generateDummyEvent : async(payload)=>{
        const response = await axiosInstance.post(API_ENDPOINTS.DATA.DUMMY_EVENT, payload)
        return response.data;
    },
    getProductLastIndex : async() => {
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.LAST_PRODUCT)
        return response.data?.data[0] ? response.data.data[0].product_no : 1;
    },
    generateDummyProduct : async(payload)=>{
        const response = await axiosInstance.post(API_ENDPOINTS.DATA.DUMMY_PRODUCT, payload)
        return response.data;
    },
    getSalesRecordLastIndex : async() => {
        const response = await axiosInstance.get(API_ENDPOINTS.DATA.LAST_SALES_RECORD)
        return response.data?.data[0] ? response.data.data[0].sale_no : 1;
    },
    generateDummySalesRecord : async(payload)=>{
        const response = await axiosInstance.post(API_ENDPOINTS.DATA.DUMMY_SALES_RECORD, payload)
        return response.data;
    },
}