import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { KPI } from '../../components/KPI';
import Chart from 'chart.js/auto';
import { overviewService } from '../../api/overview';
import { useFilterStore } from '../../store/filterStore'
import { userFilter, eventFilter, eventTypeFilter, userAccessFilter, eventDateFilter, userDateFilter } from '../../utils/filter';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Overview = () => {
  const { startTime, endTime, users, events } = useFilterStore()
  const startTs = startTime.valueOf()
  const endTs = endTime.valueOf()
  const now = new Date();
  const nowTimeStamp = Date.now();
  const [purchaseRate, setPurchaseRate] = useState(0);
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
  const [funnul, setFunnel] = useState({
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

  const fetchPurchaseRate = async () => {
    try {
      const nowStart  = new Date(now.getFullYear(), now.getMonth(), 1);
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevEnd   = new Date();
      prevEnd.setMonth(prevEnd.getMonth() - 1);
      
      const [nowList, prevList] = await Promise.all([
        overviewService.getEventType({startDate : nowStart.getTime(),   endDate : nowTimeStamp,       type: "purchase"}),
        overviewService.getEventType({startDate : prevStart.getTime(),  endDate : prevEnd.getTime(),  type: "purchase"}),
      ]);

      const nowCnt  = nowList.length
      const prevCnt = prevList.length

      const purchaseRate =
        prevCnt === 0 ? 0 : ((nowCnt - prevCnt) / prevCnt) * 100;
      setPurchaseRate(purchaseRate);
    } catch (error) {
      console.log(error)
    }
  }

  const getBoardName = async (board_no) => {
    const board = await overviewService.getBoard(board_no);
    return board.title + " (bno: " + board_no + ")"
  }

  const calcRate = (now, prev) => {
    if (!prev) return 0;
    const rate = ((now-prev)/prev)*100;
    return Number.isFinite(rate) ? rate : 0;
  }

  const calcRatio = (a, b) => {
    if(!b) return 0;
    const rate = (a / b) * 100;
    return Number.isFinite(rate) ? rate : 0;
  }

  //필터 날짜 조정 시
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, users] = await Promise.all([
          overviewService.getEvents({
            startDate: startTs,
            endDate: endTs
          }),
          overviewService.getUsers({
            startDate: startTs,
            endDate: endTs
          })
        ]);

        setFunnel({
          view: eventTypeFilter({ data: events, type: 'view' }),
          click: eventTypeFilter({ data: events, type: 'click'}),
          purchase: eventTypeFilter({ data: events, type: 'purchase'})
        });

        setEventList(events);
        setUserList(users);

      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [startTs, endTs]);

  const fetchTop5 = async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate()-7);
      const startDate = start;

      const freq = {};
      const list = await overviewService.getEventType({startDate: startDate.getTime(), endDate: nowTimeStamp, type: "click"})
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

  //초기 실행
  useEffect(() => {

    setLoading(true);
    //2달 이벤트 전체 조회
    const start = new Date();
    start.setMonth(start.getMonth()-2);
    const startDate = start;
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23,59,59,999);

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();

    const predayStart = new Date();
    predayStart.setDate(predayStart.getDate()-2);
    predayStart.setHours(0,0,0,0);
    
    const predayEnd = new Date();
    predayEnd.setDate(predayEnd.getDate()-1);
    predayEnd.setHours(23,59,59,999);

    //2달 사용자 전체 조회
    const userPromise = overviewService
      .getUsers({startDate: startDate.getTime(), endDate: nowTimeStamp})
      .then((data) => {
        setTwoMonthUserList(data);

        setUserThisMonthVisited(
          userAccessFilter({
            data: data,
            startDate: thisMonthStart.getTime(),
            endDate: thisMonthEnd.getTime(),
          })
        );

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

    //2달 이벤트 전체 조회
    const eventPromise = overviewService
      .getEvents({startDate: startDate.getTime(), endDate: nowTimeStamp})
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

    const extraPromise = Promise.all([
      fetchPurchaseRate(),
      fetchTop5(),
    ])

    Promise.all([userPromise, eventPromise, extraPromise])
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
        content="전월 대비" 
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
        <XAxis type="number" />
        <YAxis
          dataKey="board_name"
          type="category"
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
    </Container>
  );
};

export default Overview;

const Container = styled.div``;
