import React, { useEffect, useMemo, useState } from 'react';
import { eventService } from '../../api/event';
import { useFilterStore } from '../../store/filterStore';
import { userFilter } from '../../utils/filter';
import { userService } from '../../api/user';
import { boardService } from '../../api/board';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';


const Event = () => {
  const [eventInDate, setEventInDate] = useState([]);
  const [eventInPage, setEventInPage] = useState({});
  const [eventPage, setEventPage] = useState({});
  const {startTime, endTime, users} = useFilterStore();
  const startTs = startTime.valueOf();
  const endTs = endTime.valueOf();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  //페이지 이동, 사이즈
  const handleChangePage = (e, newPage) => {
    console.log("newPage",e)
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  const handleChagePage = (e, value) => {
    setPage(value);
  }

  //API로 정보 조회
  const getBoardName = async (board_no) => {
    const board = await boardService.getBoard(board_no);
    return  board.title + " (bno: " + board_no + ")"
  }

  const getUserId = async (user_no) => {
    const user = await userService.getUser(user_no);
    return user.user_id;
  }

  //페이지 및 사용자 조건 변경 시 진행
  useEffect(()=> {
    if(!eventInPage?.data) return;
    const run = async () => {
      const filtered = userFilter({data: eventInPage.data, users});
      const getEventLog = async (list) => {
        return await Promise.all(
            list
              .map(async(entry)=> {
                const userId = await getUserId(entry.user_no);
                const boardName = await getBoardName(entry.board_no);
                return({
                  create_at : entry.create_at,
                  user_id : userId,
                  event_type : entry.type,
                  board_name : boardName,
                })
          }))
      }
      console.log("page", eventInPage);
      const list = await getEventLog(filtered);
      setEventPage(prev => ({
        ...prev,
        data: list,
      }))
    };
    run();
  },[users, eventInPage])

  //날짜 및 사용자 조건 변경 시 진행
  const fitEventInDate = useMemo(()=>{
    return userFilter({data: eventInDate, users});
  },[eventInDate, users]);

  //페이지 변경 시 실행
  useEffect(()=> {
    eventService
      .getLoadEvent({page: page, size: rowsPerPage, sort: 'create_at'})
      .then((data)=> {
        setEventInPage(data);
        setEventPage(data);
      })
      .catch(console.log)
  },[page])

  //초기 렌더링 시 실행
  useEffect(()=> {
    eventService
      .getEventsInDate({startDate: startTs, endDate: endTs})
      .then((data)=> {
        setEventInDate(data);
      })
      .catch(console.log)
  },[])

  return (
    <div>
      
      <TablePagination
        component="div"
        count={eventPage.items}
        page={page-1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Stack spacing={2}>
        <Pagination 
          count={eventPage.pages} 
          page={page} 
          shape="rounded" 
          color="primary"
          onChange={handleChagePage}
        />
      </Stack>
    </div>
  );
};

export default Event; 