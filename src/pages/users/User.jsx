import React, { useEffect, useMemo, useState } from 'react';
import { userService } from '../../api/user';
import { useFilterStore } from '../../store/filterStore'
import { userAccessFilter, userTypeFilter } from '../../utils/filter'

const User = () => {
  const { startTime, endTime, users } = useFilterStore()
  const [userList, setUserList] = useState([]);
  const [monthUser, setMonthUser] = useState([]);
  const {newUser, existingUser} = useMemo(()=> {
    return{
      newUser : userTypeFilter({data: userList, type:'newUser'}),
      existingUser : userTypeFilter({data: userList, type:'existingUser'}),
    };
  },[userList])
  const [visitTable, setVisitTable] = useState([]);
  const [userChart, setUserChart] = useState([]);

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
        data: userList,
        startDate: start.getTime(),
        endDate: end.getTime()
      })
      const preWeekUser = userAccessFilter({
        data: userList,
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

  useEffect(()=> {
    userService
    .getUsers({startDate : startTime, endDate : endTime})
    .then((data)=> {setUserList(data)})
    .catch((e)=> console.log(e));
  },[startTime, endTime])

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
    .getUsers({startDate : start.getTime(), endDate : end.getTime()})
    .then((data)=> {setMonthUser(data)})
    .then(()=> {setVisitTable(getVisitTable())})
    .catch((e)=> console.log(e));
  },[])

  return <div></div>;
};

export default User;
