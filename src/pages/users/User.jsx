import React, { useEffect, useMemo, useRef, useState } from 'react';
import { userService } from '../../api/user';
import { useFilterStore } from '../../store/filterStore'
import { userAccessFilter, userDateFilter, userFilter, userTypeFilter } from '../../utils/filter'
import { eventService } from '../../api/event';
import KPI from '../../components/KPI';
import AreaChartGraph from '../../components/AreaChart';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { getWeekRange } from '../../utils/date';
import Box from '@mui/material/Box';

const User = () => {
  const { startTime, endTime, users } = useFilterStore()
  const {now, preWeek} = getWeekRange();
  const startTs = startTime.valueOf();
  const endTs = endTime.valueOf();
  
  const [allUser, setAllUser] = useState([]);
  const [visitTable, setVisitTable] = useState([]);
  const [top10, setTop10] = useState([]);
  const [topType, setTopType] = useState([]);
  const [userChart, setUserChart] = useState([]);
  const [userListInDate, setUserListInDate] = useState([]);
  const [eventInDate, setEventInDate] = useState([]);
  const [maxLength, setMaxLength] = useState(0);
  const userEventMap = useRef(new Map());

  const {newUserInDate, existingUserInDate} = useMemo(() => {
    return{
      newUserInDate       : userTypeFilter({data: userListInDate, type:'newUser'}),
      existingUserInDate  : userTypeFilter({data: userListInDate, type:'existingUser'}),
    };
  },[userListInDate])

  const getRevisitRate = ({preWeekUser, curWeekUser}) => {
    const preUserSet = new Set(preWeekUser.map((user) => user.user_no));
    const curUserSet = new Set(curWeekUser.map((user) => user.user_no));

    let revisited = 0;

    preUserSet.forEach((userId) => {
      if(curUserSet.has(userId))revisited++;
    })

    const preUserTotal = preUserSet.size;

    return preUserTotal === 0 ? 0 : ((revisited/preUserTotal) * 100)
  }

  const getVisitTable = () => {
    const table = [];
    const now = new Date();
    const day = now.getDay() || 7;
    const last = new Date();
    last.setDate(now.getDate() - day);
    const start = new Date(last);
    start.setHours(0,0,0,0);
    const end = new Date(last);
    end.setHours(23,59,59,999);
    const newUserAll = userTypeFilter({data: allUser, type: 'newUser'});
    const existingUserAll = userTypeFilter({data: allUser, type: 'existingUser'});

    const preStart = new Date(last)
    preStart.setHours(0,0,0,0);
    const preEnd = new Date(last)
    preEnd.setHours(23,59,59,999);
    for (let i = 0; i < 4; i++) {
      start.setDate(last.getDate() - 7*(i+1) + 1);
      end.setDate(last.getDate() - 7*i);
      preStart.setDate(last.getDate() - 7*(i+2) + 1);
      preEnd.setDate(last.getDate() - 7*(i+1));
      const newUsers = userAccessFilter({
        data: newUserAll,
        startDate: start.getTime(), 
        endDate: end.getTime()
      })
      const existingUsers = userAccessFilter({
        data: existingUserAll, 
        startDate: start.getTime(), 
        endDate: end.getTime()
      })
      const curWeekUser = userAccessFilter({
        data: userListInDate,
        startDate: start.getTime(),
        endDate: end.getTime()
      })
      const preWeekUser = userAccessFilter({
        data: userListInDate,
        startDate: preStart.getTime(),
        endDate: preEnd.getTime()
      })

      table.push({
        startDay      : `${String(start.getMonth() + 1).padStart(2, '0')}/${String(start.getDate()).padStart(2,'0')}`,
        endDay        : `${String(end.getMonth() + 1).padStart(2, '0')}/${String(end.getDate()).padStart(2,'0')}`,
        newUser       : newUsers.length,
        existingUser  : existingUsers.length,
        revisitRate   : getRevisitRate({preWeekUser, curWeekUser}),
      })
    }
    return table.reverse();
  }

  const getUserInfo = async(user_no) => {
    const user = await userService.getUser(user_no);
    return user;
  }

  const changeTop10FromEvent = async (type) => {
    const entries = Array.from(userEventMap.current);
    let sorted = [];
    if(type === 'all') {
      sorted = entries.sort(function(a,b){
                        return b[1].event - a[1].event
                      })
    } else if(type === 'view') {
      sorted = entries.sort(function(a,b){
                        return b[1].view - a[1].view
                      })
    } else if(type === 'click') {
      sorted = entries.sort(function(a,b){
                        return b[1].click - a[1].click
                      })
    } else if(type === 'purchase') {
      sorted = entries.sort(function(a,b){
                        return b[1].purchase - a[1].purchase
                      })
    }
    setTopType(type);
    let max = 1;

    const enriched = await Promise.all(
      sorted.map(async ([key, value]) => {
        const user = await getUserInfo(key);
        const filtered = userFilter({ data: user, users });

        if (!filtered.length) return null;

        return {
          user: filtered[0],
          value
        };
      })
    );
    const listTop10 = enriched
      .filter(Boolean)
      .slice(0, 10)
      .map(({ user, value }) => {
        const val =
          (type==='view'    && value.view) ||
          (type==='click'   && value.click) ||
          (type==='purchase'&& value.purchase) ||
          (type==='all'     && value.event);

        if (val > max) max = val;

        return {
          type: (user.create_at >= preWeek && user.create_at <= now ? '신규 회원' : '기존 회원'),
          user_id: user.user_id,
          view: value.view,
          click: value.click,
          purchase: value.purchase,
          event: value.event,
          bar: val
        };
      });
    setMaxLength(max);
    setTop10(listTop10);
    console.log(top10);
  }

  //필터 적용시
  useEffect(()=>{
    userEventMap.current = new Map();
    setTop10([]);
    setUserListInDate(userDateFilter({data: allUser, startDate : startTs, endDate : endTs}));
    eventService.getEventsInDate({startDate: startTs, endDate: endTs})
      .then((data)=> {
        setEventInDate(data)
        
        data.forEach(item => {
          if(!userEventMap.current.has(item.user_no)) 
            userEventMap.current.set(item.user_no, 
              {view: 0, click: 0, purchase: 0, event: 0}
            )
          
          const prev = userEventMap.current.get(item.user_no);

          userEventMap.current.set(item.user_no, {
            view:     prev.view       + (item.type==='view'), 
            click:    prev.click      + (item.type==='click'), 
            purchase: prev.purchase   + (item.type==='purchase'), 
            event:    prev.event      + 1, 
          })
        })
        changeTop10FromEvent('all')
      })
      .catch(console.log)
  },[startTime, endTime, allUser, users])

  useEffect(()=>{
    setVisitTable(getVisitTable());
  },[allUser])

  //초기 실행
  useEffect(()=> {
    const now = new Date();
    const day = now.getDay() || 7;

    const end = new Date();
    end.setDate(now.getDate() - day);
    end.setHours(23,59,59,999);

    const start = new Date();
    start.setDate(end.getDate() - 35);
    start.setHours(0,0,0,0);

    userService
    .getAllUsers()
    .then((data)=> {
      setAllUser(data);
    })
    .catch((e)=> console.log(e));
  },[])

  return (
  <div>
    <KPI
      title={'총 사용자 수'}
      value={allUser.length}
    />
    <KPI
      title={'기간 내 사용자 수'}
      value={userListInDate.length}
    />
    <AreaChartGraph
    />

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>기간</TableCell>
            <TableCell align="right">신규 회원</TableCell>
            <TableCell align="right">기존 회원</TableCell>
            <TableCell align="right">재방문율</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visitTable.map((row) => (
            <TableRow
              key={row.startDay}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {`${row.startDay}-${row.endDay}`}
              </TableCell>
              <TableCell align="right">{row.newUser}</TableCell>
              <TableCell align="right">{row.existingUser}</TableCell>
              <TableCell align="right">{row.revisitRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>사용자 아이디</TableCell>
            <TableCell align="right">회원 유형</TableCell>
            <TableCell align="right" onClick={() => changeTop10FromEvent('view')} sx={{
                      cursor: 'pointer',
                      backgroundColor: topType==='view'&&'secondary.main',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}>조회</TableCell>
            <TableCell align="right" onClick={() => changeTop10FromEvent('click')} sx={{
                      cursor: 'pointer',
                      backgroundColor: topType==='click'&&'secondary.main',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}>방문</TableCell>
            <TableCell align="right" onClick={() => changeTop10FromEvent('purchase')} sx={{
                      cursor: 'pointer',
                      backgroundColor: topType==='purchase'&&'secondary.main',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}>구매</TableCell>
            <TableCell align="right" onClick={() => changeTop10FromEvent('all')} sx={{
                      cursor: 'pointer',
                      backgroundColor: topType==='all'&&'secondary.main',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}>총 이벤트량</TableCell>
            <TableCell align="right">Bar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {top10.map((row) => (
            <TableRow
              key={row.user_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.user_id}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.view}</TableCell>
              <TableCell align="right">{row.click}</TableCell>
              <TableCell align="right">{row.purchase}</TableCell>
              <TableCell align="right">{row.event}</TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    width: `${(row.bar / maxLength) * 100}%`,
                    height: 10,
                    borderRadius: 1,
                    bgcolor: 'primary.main'
                  }}
                />
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
};

export default User;
