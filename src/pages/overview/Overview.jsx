import { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { KPI } from '../../components/KPI';
import Chart from 'chart.js/auto';
import { overviewService } from '../../api/overview';
import { 
  events, 
  users, 
  startTime,
  endTime,
} from '../../store/filterStore';
import { userFilter, eventFilter, eventTypeFilter } from '../../utils/filter';

const Overview = () => {
  const multiLineRef = useRef(null);
  const multiLineChartRef = useRef(null);
  const pieRef = useRef(null);
  const pieChartRef = useRef(null);
  const now = new Date();
  const nowTimeStamp = Date.now();
  const [purchaseRate, setPurchaseRate] = useState(0);
  const [top5, setTop5] = useState([]);
  const [userList, setUserList] = useState([]);
  const [eventList, setEventList] = useState([]);
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

  const fetchPurchaseCnt = async () => {
    try {
      const nowStart  = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
      const prevEnd   = new Date();
      prevEnd.setMonth(prevEnd.getMonth() - 1);
      
      const [nowList, prevList] = await Promise.all([
        overviewService.getEventType({startDate : nowStart,   endDate : nowTimeStamp, type: "purchase"}).length,
        overviewService.getEventType({startDate : prevStart,  endDate : prevEnd,      type: "purchase"}).length,
      ]);

      const nowCnt  = nowList.length
      const prevCnt = prevList.length

      const purchaseRate = ((nowCnt-prevCnt)/prevCnt)*100;
      setPurchaseRate(purchaseRate);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    overviewService
    .getEvents({startDate: startTime, endDate: endTime})
    .then((data) => {
      setFunnel({
        view      : eventTypeFilter(data, 'view'),
        click     : eventTypeFilter(data, 'click'),
        purchase  : eventTypeFilter(data, 'purchase')
      })
    })
    .catch((e) => console.log(e))
  },[startTime, endTime])  

  const fetchTop5 = async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate()-7);
      const startDate = start.getTime();

      const freq = {};
      const list = await overviewService.getEventType({startDate, endDate: nowTimeStamp, type: "click"})
      list.forEach(item => {
          freq[item.board_no] = ((freq[item.board_no] || 0) + 1);
      });

      const listTop5 = Object.entries(freq)
                      .sort((a,b)=> b[1]-a[1])
                      .slice(0,5)
                      .map(([key])=> key);

      setTop5(listTop5);
    } catch (error) {
      console.log(error);
    }
  }

  //초기 실행
  useEffect(() => {
    //한달 이벤트 전체 조회
    const start = new Date();
    start.setMonth(start.getMonth()-1);
    const startDate = start.getTime();
    overviewService
      .getEvents({startDate, endDate: nowTimeStamp})
      .then((data) => {
        setEventList(data);
      })
      .catch((e)=> console.log(e));

    //한달 사용자 전체 조회
    overviewService
      .getUsers({startDate, endDate: nowTimeStamp})
      .then((data) => {
        setUserList(data);
      })
      .catch((e)=> console.log(e));

    fetchPurchaseCnt();
    fetchTop5();

    if (!multiLineRef.current || !pieRef.current) return;

    if (multiLineChartRef.current) {
      multiLineChartRef.current.destroy();
    }
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    multiLineChartRef.current = new Chart(multiLineRef.current, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'page_view',
            data: [23, 65, 40, 67],
            order: 3,
          },
          {
            label: 'click',
            data: [8, 32, 18, 40],
            order: 2,
          },
          {
            label: 'purchase',
            data: [4, 8, 6, 9],
            order: 1,
          },
        ],
        labels: ['January', 'February', 'March', 'April'],
      },
      options: {
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeOutQuad',
            from: 0.3,
            to: 0,
            loop: true,
          },
        },
      },
    });

    pieChartRef.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: ['신규 유저', '재방문 유저'],
        datasets: [
          {
            label: '재방문율',
            data: [30, 120],
            backgroundColor: ['#BFDBFE', '#378ADD'],
          },
        ],
        hoverOffset: 4,
      },
      options: {
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeOutQuad',
            from: 0.3,
            to: 0,
            loop: true,
          },
        },
      },
    });

    return () => {
      multiLineChartRef.current?.destroy();
    };
  }, []);

  return (
    <Container>
      <KPI title="오늘 방문자 수" value={1284} content="전일 대비" diff="+8.2%" />
      <canvas
        style={{
          width: '500px',
          height: '200px',
        }}
        ref={multiLineRef}
      />
      <canvas ref={pieRef} />
    </Container>
  );
};

export default Overview;

const Container = styled.div``;
