import React, { useEffect, useMemo, useRef, useState } from 'react';
import { userService } from '../../api/user';
import { useFilterStore } from '../../store/filterStore'
import { userAccessFilter, userDateFilter, userTypeFilter } from '../../utils/filter'
import { eventService } from '../../api/event';

const User = () => {
  const { startTime, endTime, users } = useFilterStore()
  const startTs = startTime.valueOf();
  const endTs = endTime.valueOf();
  
  const [allUser, setAllUser] = useState([]);
  const [monthUser, setMonthUser] = useState([]);
  const [visitTable, setVisitTable] = useState([]);
  const [userChart, setUserChart] = useState([]);
  const [userListInDate, setUserListInDate] = useState([]);
  const [eventInDate, setEventInDate] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const userEventMap = useRef(new Map());

  const {newUserInDate, existingUserInDate} = useMemo(() => {
    return{
      newUserInDate       : userTypeFilter({data: userListInDate, type:'newUser'}),
      existingUserInDate  : userTypeFilter({data: userListInDate, type:'existingUser'}),
    };
  },[userListInDate])

  const getRevisitRate = ({preWeek, curWeek}) => {
    const preUserSet = new Set(preWeek.map((user) => user.user_no));
    const curUserSet = new Set(curWeek.map((user) => user.user_no));

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
    const newUserAll = userTypeFilter({data: monthUser, type: 'newUser'});
    const existingUserAll = userTypeFilter({data: monthUser, type: 'existingUser'});

    const preStart = new Date(last)
    preStart.setHours(0,0,0,0);
    const preEnd = new Date(last)
    preEnd.setHours(23,59,59,999);
    for (let i = 0; i < 4; i++) {
      start.setDate(last.getDate() - 7*(i+1) + 1);
      end.setDate(last.getDate() - 7*i);
      preStart.setDate(last.getDate() - 7*(i+2) + 1);
      preEnd.setDate(last.getDate() - 7*(i+1));
      const newUser = userAccessFilter({
        data: newUserAll,
        startDate: start.getTime(), 
        endDate: end.getTime()
      })
      const existingUser = userAccessFilter({
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
        startDay      : start,
        endDay        : end,
        newUser       : newUser.length,
        existingUser  : existingUser.length,
        revisitRate   : getRevisitRate({preWeekUser, curWeekUser}),
      })
    }
    return table.reverse();
  }

  const getUserId = async(user_no) => {
    const user = await userService.getUser(user_no);
    return user.user_id;
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
    const listTop10 = await Promise.all(
      sorted
      .slice(0,10)
      .map(async([key, value])=> ({
        user_id   : await getUserId(key),
        view      : value.view,
        click     : value.click,
        purchase  : value.purchase,
        event     : value.event,
      }))
    )

    setUserChart(listTop10);
  }

  //날짜 변경시
  useEffect(()=>{
    setUserListInDate(userDateFilter({data: allUser, startDate : startTs, endDate : endTs}));
    eventService.getEventsInDate({startDate: startTs, endDate: endTs})
                .then((data)=> {
                  setEventInDate(data)
                  
                  eventInDate.forEach(item => {
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
                })
                .catch(console.log)
  },[startTime, endTime, allUser])

  //초기 실행
  useEffect(()=> {
    const now = new Date();
    const day = now.getDay() || 7;
    const end = new Date();
    end.setDate(now.getDate() - day);
    end.setHours(23,59,59,999);
    const start = new Date(end);
    start.setDate(end.getDate() - 35);
    start.setHours(0,0,0,0);
    userService
    .getAllUsers()
    .then((data)=> {
      setAllUser(data);
      setMonthUser(userDateFilter({data: data, startDate: start, endDate: end}));
      setVisitTable(getVisitTable());
    })
    .catch((e)=> console.log(e));
  },[])

  return <div></div>;
};

export default User;
