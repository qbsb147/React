import React, { useEffect, useRef, useState } from 'react';
import { userService } from '../../api/user';
import { useFilterStore } from '../../store/filterStore'
import { userAccessFilter,userFilter} from '../../utils/filter'
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
import dayjs from 'dayjs';
import { dayOfWeek } from '../DataFactory/data';

const User = () => {
  const { startTime, endTime, users } = useFilterStore()
  const {now, preWeek} = getWeekRange();
  const startTs = startTime.valueOf();
  const endTs = endTime.valueOf();
  
  const [userCnt, setUserCnt] = useState(0);
  const [monthUser, setMonthUser] = useState([]);
  const [visitTable, setVisitTable] = useState([]);
  const [top10, setTop10] = useState([]);
  const [topType, setTopType] = useState([]);
  const [userChart, setUserChart] = useState([]);
  const [userListInDate, setUserListInDate] = useState([]);
  const [maxLength, setMaxLength] = useState(0);
  const userEventMap = useRef(new Map());

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
    
    for (let i = 0; i < 4; i++) {
      const start = new Date(last);
      const end = new Date(last);
      const preStart = new Date(last)
      const preEnd = new Date(last)
      
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      preStart.setHours(0,0,0,0);
      preEnd.setHours(23,59,59,999);

      start.setDate(last.getDate() - 7*(i+1) + 1);
      end.setDate(last.getDate() - 7*i);
      preStart.setDate(last.getDate() - 7*(i+2) + 1);
      preEnd.setDate(last.getDate() - 7*(i+1));
      
      const newUserAll = monthUser.filter((user)=> (user.create_at > start && user.create_at <= end));
      const existingUserAll = monthUser.filter((user)=> (user.create_at <= start));

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
    setTopType(type);
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
    const topEntries = sorted.slice(0,10);

    const enriched = await Promise.all(
      topEntries.map(async ([key, value]) => {
        const user = await getUserInfo(key);
        const filtered = userFilter({ data: [user], users });

        if (!filtered.length) return null;

        return {
          user: filtered[0],
          value
        };
      })
    );

    let max = 1;

    const listTop10 = enriched
      .filter(Boolean)
      .slice(0, 10)
      .map(({ user, value }) => {
        const val =
          (type==='view'    && value.view)     ||
          (type==='click'   && value.click)    ||
          (type==='purchase'&& value.purchase) ||
          (type==='all'     && value.event);

        if (val > max) max = val;

        return {
          type: (user.create_at > preWeek && user.create_at <= now ? '신규 회원' : '기존 회원'),
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
  }

  //필터 적용시
  useEffect(()=>{
    userEventMap.current = new Map();
    const map = new Map();
    setTop10([]);
    userService.getUsersInDate({startDate: startTs, endDate: endTs})
      .then((data) => {
        setUserListInDate(data);
        data.forEach(item => {
          const creatAt  = new Date(item.create_at);
          const preDate  = new Date(item.create_at);
          const start    = preDate.setDate(preDate.getDate() - 7);
          const end      = creatAt.getTime();
          const tdate    = new Date(item.access_time).getTime();
          
          const date     = new Date(item.access_time);
          const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          let time = '';
          let sortKey = 0;
          const gap = endTs - startTs;

          if(     gap >  (365 * 7 * 24 * 60 * 60 * 1000)){
            time    = date.getFullYear()     + '년';
            sortKey = new Date(date.getFullYear(), 0, 1).getTime();
          }
          else if(gap >  (lastDate.getDate() * 7 * 24 * 60 * 60 * 1000)) {
            time    = (date.getMonth() + 1)  + '월';
            sortKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          }
          else if(gap >  (7 * 24 * 60 * 60 * 1000)){
            const bucket = Math.floor(date.getDate()/5);
            time    = bucket*5 + ' ~ ' + Math.min((bucket+1)*5, lastDate.getDate()) + '일';
            sortKey = new Date(date.getFullYear(), date.getMonth(), bucket * 5).getTime();
          }
          else if(gap >  (24 * 60 * 60 * 1000)){
            time    = dayOfWeek[date.getDay()];
            sortKey = new Date(date.setDate(date.getDate() - date.getDay())).getTime();
          }
          else {
            time    = date.getHours()        + '시';
            sortKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
          }
          
          if(!map.has(sortKey))
            map.set(sortKey, 
              {time: time, sortKey, newUser: 0, existingUser: 0}
            )

          const prev = map.get(sortKey);

          map.set(sortKey,{
            time          : time,
            newUser       : prev.newUser      + (tdate >   start && tdate <= end),
            existingUser  : prev.existingUser + (tdate <=  start),
            sortKey       : prev.sortKey,
          })
        })
        setUserChart(Array.from(map.values()).sort((a,b) => a.sortKey - b.sortKey));
      })
      .catch(console.log);
    eventService.getEventsInDate({startDate: startTs, endDate: endTs})
      .then((data)=> {
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
  },[startTs, endTs, users])

  useEffect(()=>{
    setVisitTable(getVisitTable());
  },[monthUser])

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
      .getUserCnt()
      .then((data)=> {
        setUserCnt(data);
      })
      .catch(console.log);

    userService
      .getUsersInDate({startDate: start.getTime(), endDate: end.getTime()})
      .then((data)=>{
        setMonthUser(data);
      })
      .catch(console.log)
  },[])

  return (
  <div>
    <KPI
      title={'총 사용자 수'}
      value={userCnt}
    />
    <KPI
      title={'기간 내 사용자 수'}
      value={userListInDate.length}
    />
    <AreaChartGraph
      data={userChart}
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
              <TableCell align="right">{row.revisitRate.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{width : 100}}>사용자 아이디</TableCell>
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
            <TableCell align="right" sx={{minWidth : 200}}>Bar</TableCell>
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
