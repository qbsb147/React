import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { KPI } from '../../components/KPI';
import Chart from 'chart.js/auto';

const Overview = () => {
  const multiLineRef = useRef(null);
  const multiLineChartRef = useRef(null);
  const pieRef = useRef(null);
  const pieChartRef = useRef(null);
  useEffect(() => {
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
      <KPI title="오늘 방문자 수" value={1284} content="전일 대비" diff="+8.2%" color />
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
