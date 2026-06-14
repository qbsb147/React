import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { KPI } from '../../components/KPI';
import Chart from 'chart.js/auto';
import { useFilterStore } from '../../store/filterStore'
import { userFilter, eventFilter, eventTypeFilter, userAccessFilter, eventDateFilter, userDateFilter, userTypeFilter } from '../../utils/filter';
import { Bar, BarChart, CartesianGrid, Funnel, FunnelChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PieWithGradient from '../../components/PieChart';
import { eventService } from '../../api/event';
import { userService } from '../../api/user';
import { boardService } from '../../api/board';
import { useTheme } from 'styled-components';

const Overview = () => {
  const theme = useTheme();
  const { startTime, endTime, users, events } = useFilterStore()
  const startTs = startTime.valueOf()
  const endTs = endTime.valueOf()
  const now = new Date();
  const nowTimeStamp = Date.now();
  const [top5, setTop5] = useState([]);
  const [userThisMonthVisited, setUserThisMonthVisited] = useState([]);
  const [userLastMonthVisited, setUserLastMonthVisited] = useState([]);
  const [eventThisMonthVisited, setEventThisMonthVisited] = useState([]);
  const [eventLastMonthVisited, setEventLastMonthVisited] = useState([]);
  const [userTodayVisited, setUserTodayVisited] = useState([]);
  const [userPredayVisited, setUserPredayVisited] = useState([]);
  const [twoMonthUserList, setTwoMonthUserList] = useState([]);
  const [twoMonthEventList, setTwoMonthEventList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [funnel, setFunnel] = useState({
    view      : 0,
    click     : 0,
    purchase  : 0,
  });
  const [multiLine, setMultiLine] = useState({
    view      : [],
    click     : [],
    purchase  : [],
  })

  const eventCnt = useMemo(() => {
    return eventFilter({data: eventList, events}).length;
  }, [eventList, events])

  const userCnt = useMemo(()=>{
    return userFilter({data: userList, users}).length;
  }, [userList, users])

  const clickEventMonthCnt = eventTypeFilter({data: eventThisMonthVisited, type : 'click'}).length
  const purchaseEventMonthCnt = eventTypeFilter({data: eventThisMonthVisited, type : 'purchase'}).length

  const getBoardName = async (board_no) => {
    const board = await boardService.getBoard(board_no);
    return board.title + " (bno: " + board_no + ")"
  }

  const calcRate = (now, prev) => {
    if (!prev) return now;
    const rate = ((now-prev)/prev)*100;
    return Number.isFinite(rate) ? rate : 0;
  }

  const calcRatio = (a, b) => {
    if(!b) return 0;
    const rate = (a / b) * 100;
    return Number.isFinite(rate) ? rate : 0;
  }

  const pieData = useMemo(()=>{
    const filteredUser = userDateFilter({data: twoMonthUserList, startDate: startTs, endDate: endTs})
    const newUser = userTypeFilter({data: filteredUser, type: 'newUser'});
    const existingUser = userTypeFilter({data: filteredUser, type: 'existingUser'});

    return [
      {name: '신규 사용자', value: newUser.length},
      {name: '기존 사용자', value: existingUser.length},
    ]
  },[twoMonthUserList, startTs, endTs])

  const purchaseRate = useMemo(() => {
    const nowStart  = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd   = new Date();
    prevEnd.setMonth(prevEnd.getMonth() - 1);

    const filteredNow = eventDateFilter({data: twoMonthEventList, startDate : nowStart.getTime(), endDate : nowTimeStamp});
    const nowList = eventTypeFilter({data: filteredNow, type: "purchase"});
    const filteredPre = eventDateFilter({data: twoMonthEventList, startDate : prevStart.getTime(), endDate : prevEnd.getTime()});
    const prevList = eventTypeFilter({data: filteredPre, type: "purchase"});

    const nowCnt  = nowList.length
    const prevCnt = prevList.length

    console.log("nowList",nowList)
    console.log("prevList",prevList)

    return prevCnt === 0 ? nowCnt : ((nowCnt - prevCnt) / prevCnt) * 100;
  },[twoMonthEventList])

  const fetchTop5 = async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate()-7);
      const startDate = start;

      const freq = {};
      const filteredList = eventDateFilter({data: twoMonthEventList, startDate: startDate.getTime(), endDate: nowTimeStamp})
      const list = eventTypeFilter({data: filteredList, type: "click"})
      list.forEach(item => {
        freq[item.board_no] = ((freq[item.board_no] || 0) + 1);
      });
      
      const listTop5 = await Promise.all(
        Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(async ([key, value]) => ({
            board_name: await getBoardName(key),
            count: value,
          }))
      );

      setTop5(listTop5);
    } catch (error) {
      console.log(error);
    }
  }

  //2달 데이터 가져올 시
  useEffect(()=>{
    if(!Array.isArray(twoMonthEventList) || twoMonthEventList.length === 0)return;
    fetchTop5()
  }, [twoMonthEventList])

  //필터 날짜 조정 시
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, users] = await Promise.all([
          eventService.getEventsInDate({
            startDate: startTs,
            endDate: endTs
          }),
          userService.getUsersInDate({
            startDate: startTs,
            endDate: endTs
          })
        ]);

        setFunnel({
          view: eventTypeFilter({ data: events, type: 'view' }).length,
          click: eventTypeFilter({ data: events, type: 'click'}).length,
          purchase: eventTypeFilter({ data: events, type: 'purchase'}).length
        });

        setEventList(events);
        setUserList(users);

      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [startTs, endTs]);

  //초기 실행
  useEffect(() => {

    setLoading(true);
    //2달 이벤트 전체 방문
    const start = new Date();
    start.setMonth(start.getMonth()-2);
    const startDate = start;
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const lastMonthEnd = new Date();
    const day = lastMonthEnd.getDate();
    lastMonthEnd.setMonth(now.getMonth()-1);
    if(lastMonthEnd.getDate() !== day){
      lastMonthEnd.setDate(0);
    }

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();

    const predayStart = new Date();
    predayStart.setDate(predayStart.getDate()-1);
    predayStart.setHours(0,0,0,0);
    
    const predayEnd = new Date();
    predayEnd.setDate(predayEnd.getDate()-1);

    //2달 사용자 전체 방문
    const userPromise = userService
      .getUsersInDate({startDate: startDate.getTime(), endDate: nowTimeStamp})
      .then((data) => {
        setTwoMonthUserList(data);

        setUserThisMonthVisited(
          userAccessFilter({
            data: data,
            startDate: thisMonthStart.getTime(),
            endDate: thisMonthEnd.getTime(),
          })
        );
        const res = userAccessFilter({
            data: data,
            startDate: lastMonthStart.getTime(),
            endDate: lastMonthEnd.getTime(),
          })
        console.log("res",res)

        setUserLastMonthVisited(
          userAccessFilter({
            data: data,
            startDate: lastMonthStart.getTime(),
            endDate: lastMonthEnd.getTime(),
          })
        );

        setUserTodayVisited(
          userAccessFilter({
            data: data,
            startDate: todayStart.getTime(),
            endDate: todayEnd.getTime(),
          })
        );

        setUserPredayVisited(
          userAccessFilter({
            data: data,
            startDate: predayStart.getTime(),
            endDate: predayEnd.getTime(),
          })
        );
      })
      .catch((e)=> console.log(e));

    //2달 이벤트 전체 방문
    const eventPromise = eventService
      .getEventsInDate({startDate: startDate.getTime(), endDate: nowTimeStamp})
      .then((data) => {
        setTwoMonthEventList(data);

        setEventThisMonthVisited(
          eventDateFilter({
            data: data,
            startDate: thisMonthStart.getTime(),
            endDate: thisMonthEnd.getTime(),
          })
        );

        setEventLastMonthVisited(
          eventDateFilter({
            data: data,
            startDate: lastMonthStart.getTime(),
            endDate: lastMonthEnd.getTime(),
          })
        );
      })
      .catch((e)=> console.log(e));

    Promise.all([userPromise, eventPromise])
    .catch(console.log)
    .finally(()=>{
      setLoading(false);
    })
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <KPI 
        title="오늘 방문자 수" 
        value={userTodayVisited.length} 
        content="전일 대비" 
        diff={calcRate(userTodayVisited.length, userPredayVisited.length)} 
      />
      <KPI 
        title="한달 방문자 수" 
        value={userThisMonthVisited.length} 
        content="전월 동기" 
        diff={calcRate(userThisMonthVisited.length, userLastMonthVisited.length)} 
      />
      <KPI 
        title="한달 이벤트 수" 
        value={eventThisMonthVisited.length} 
        content="전일 대비" 
        diff={calcRate(eventThisMonthVisited.length, eventLastMonthVisited.length)} 
      />
      <KPI 
        title="이달 구매 전환율" 
        value={calcRatio(purchaseEventMonthCnt, clickEventMonthCnt)} 
        content="전월 동기" 
        diff={purchaseRate} 
      />
      <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer
        height="100%"
        width="100%"
      >
        <BarChart
            accessibilityLayer
            barCategoryGap="10%"
            barGap={4}
            data={top5}
            height={300}
            width={300}
            layout='vertical'
            style={{}}
            syncMethod="index"
            throttleDelay="raf"
            margin={{
              bottom: 5,
              left: 20,
              right: 30,
              top: 20
            }}
            responsive
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
        type="number" 
        stroke={theme.colors.line}
        />
        <YAxis
          dataKey="board_name"
          type="category"
          stroke={theme.colors.line}
          width={400}
          tick
        />
        <Legend />
        <Tooltip />
        <Bar 
          dataKey="count"
          fill="#8884d8"
          stackId="a"
        />
        </BarChart>
      </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer
        height={200}
        width="100%"
      >
        <FunnelChart
          accessibilityLayer
          data={[
            {
              fill: '#E6E6FA',
              name: 'view',
              value: funnel.view
            },
            {
              fill: '#C8A2C8',
              name: 'click',
              value: funnel.click
            },
            {
              fill: '#8A5FBF',
              name: 'purchase',
              value: funnel.purchase
            }
          ]}
        >
          <Funnel
            activeShape={{
              fill: '#6D28D9',
              stroke: '#38BDF8'
            }}
            dataKey="value"
            isAnimationActive
            lastShapeType="rectangle"
            shape={{}}
            stroke="#424242"
          >
            <LabelList
              dataKey="name"
              fill= {theme.colors.text.primary}
              position="right"
              stroke="none"
            />
          </Funnel>
          <Tooltip />
        </FunnelChart>
      </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", height: 300 }}>
      <PieWithGradient
        data={pieData}
      />
      </div>
    </Container>
  );
};

export default Overview;

const Container = styled.div``;
