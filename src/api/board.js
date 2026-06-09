import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const boardService = {
    //게시글 하나 가져오기
    getBoard : async(board_no) => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.BOARD.GET(board_no)
        )
        return response.data[0];
    }
}