import React, { useEffect, useMemo, useState } from 'react';
import { eventService } from '../../api/event';
import { useFilterStore } from '../../store/filterStore';
import { eventTypeFilter, userFilter } from '../../utils/filter';
import { userService } from '../../api/user';
import { boardService } from '../../api/board';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const Event = () => {
  const [eventInDate, setEventInDate] = useState([]);
  const [eventInPage, setEventInPage] = useState({});
  const [eventPage, setEventPage] = useState({});
  const {startTime, endTime, users} = useFilterStore();
  const startTs = startTime.valueOf();
  const endTs = endTime.valueOf();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logLoading, setLogLoading] = useState(true);
  const [eventInFilter, setEventInFilter] = useState([]);
  const [viewInFilter, setViewInFilter] = useState([]);
  const [clickInFilter, setClickInFilter] = useState([]);
  const [purchaseInFilter, setPurchaseInFilter] = useState([]);

  const handleChangePage = (e, value) => {
    setPage(value);
  }

  //API로 정보 방문
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
                const date = new Date(entry.create_at);
                return({
                  create_at : date.toLocaleString(),
                  user_id : userId,
                  event_type : entry.type,
                  board_name : boardName,
                })
          }))
      }
      const list = await getEventLog(filtered);
      setEventPage(prev => ({
        ...prev,
        data: list,
      }))

      setLogLoading(false);
    };
    run();
  },[users, eventInPage])

  //날짜 및 사용자 조건 변경 시 진행
  useEffect(()=> {
    const filteredEvent = userFilter({data: eventInDate, users});
    setEventInFilter(filteredEvent);
    setViewInFilter(eventTypeFilter({data: filteredEvent, type: 'view'}));
    setClickInFilter(eventTypeFilter({data: filteredEvent, type: 'click'}));
    setPurchaseInFilter(eventTypeFilter({data: filteredEvent, type: 'purchase'}));
  },[eventInDate, users]);

  //페이지 변경 시 실행
  useEffect(()=> {
    setLogLoading(true);
    eventService
      .getLoadEvent({page: page, size: rowsPerPage, sort: 'create_at'})
      .then((data)=> {
        setEventInPage(data);
        const {data: _, ...rest} = data;
        setEventPage(rest);
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

  const columns = [
    { field: 'create_at', headerName: '타임스탬프', minWidth : 200 },
    { field: 'user_id', headerName: '사용자ID', minWidth : 150 },
    { field: 'event_type', headerName: '이벤트', minWidth : 100 },
    { field: 'board_name', headerName: '상품', flex : 1},
  ]
  return (
    <div>
      <Title>
        시간별 이벤트 발생량
      </Title>
      <BarChart
        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
        responsive
        // data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" niceTicks="snap125" />
        <YAxis width="auto" niceTicks="snap125" />
        <Tooltip />
        <Legend />
        <Bar dataKey="view" stackId="a" fill="#185FA5" background />
        <Bar dataKey="click" stackId="a" fill="#97C459" background />
        <Bar dataKey="purchase" stackId="a" fill="#EF9F27" background />
        <RechartsDevtools />
      </BarChart>
      <EventType>
        <Title>이벤트 타입 분포</Title>
        <TypeBox>
          <TopRow>
            <TypeName>조회</TypeName>
            <Count>{viewInFilter.length.toLocaleString()}</Count>
          </TopRow>
          <Gauge>
            <Box
              sx={{
                width: `${(viewInFilter.length / eventInFilter.length) * 100}%`,
                height: 10,
                borderRadius: 1,
                bgcolor: '#185FA5'
              }}
            />
          </Gauge>
          <Content>전체의 {((viewInFilter.length / eventInFilter.length) * 100).toFixed(1)}%</Content>
        </TypeBox>
        <TypeBox>
          <TopRow>
            <TypeName>방문</TypeName>
            <Count>{clickInFilter.length.toLocaleString()}</Count>
          </TopRow>
          <Gauge>
            <Box
              sx={{
                width: `${(clickInFilter.length / eventInFilter.length) * 100}%`,
                height: 10,
                borderRadius: 1,
                bgcolor: '#97C459'
              }}
            />
          </Gauge>
          <Content>전체의 {((clickInFilter.length / eventInFilter.length) * 100).toFixed(1)}%</Content>
        </TypeBox>
        <TypeBox>
          <TopRow>
            <TypeName>구매</TypeName>
            <Count>{purchaseInFilter.length.toLocaleString()}</Count>
          </TopRow>
          <Gauge>
            <Box
              sx={{
                width: `${(purchaseInFilter.length / eventInFilter.length) * 100}%`,
                height: 10,
                borderRadius: 1,
                bgcolor: '#EF9F27'
              }}
            />
          </Gauge>
          <Content>전체의 {((purchaseInFilter.length / eventInFilter.length) * 100).toFixed(1)}%</Content>
        </TypeBox>
      </EventType>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={eventPage.data ?? []}
          loading={logLoading}
          columns={columns}
          getRowId={(row)=> row.user_id}
          disableRowSelectionOnClick
          rowCount={eventPage.items}
          paginationMode="server"
          pageSizeOptions={[10, 20, 50]}
          paginationModel={{
            page: page - 1,
            pageSize: rowsPerPage
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setRowsPerPage(model.pageSize);
          }}
        />
      </Box>
      <Stack 
        spacing={2}
      >
        <Pagination 
          count={eventPage.pages}
          page={page} 
          shape="rounded" 
          color="primary"
          siblingCount={3} 
          onChange={handleChangePage}
          sx={{display : 'flex', justifyContent: "center"}}
        />
      </Stack>
    </div>
  );
};

export default Event; 

const EventType = styled.div`
  margin: 10px 0px;
  display: grid;
  gap: 10px;
`

const Title = styled.div`
  margin: 10px 0px;
  display:flex;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
`

const TypeBox = styled.div`
`

const TopRow = styled.div`
  display:flex;
  justify-content: space-between;
  margin : 0px 20px 0px 0px;
  font-size: ${({ theme }) => theme.fontSizes.lg};;
`

const TypeName = styled.div`
  justify-content: flex-start;
`

const Count = styled.div`
  justify-content: flex-end;
`

const Gauge = styled.div`
  justify-content: flex-start;
`
const Content = styled.div`
  display:flex;
  justify-items: flex-start;
  font-size: ${({ theme }) => theme.fontSizes.sm};;
`
