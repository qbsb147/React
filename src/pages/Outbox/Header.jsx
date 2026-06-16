import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Header = () => {
    const location = useLocation();
    const path = location.pathname;
    const segment = path.split('/')[1];
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    const now = new Date();
    const currentTime = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  return (
    <Container>
      <Top>
        <Line1>
            {(title? title : 'Overview') + ' 대시보드'}
        </Line1>
        <Line2>
            {currentTime}
        </Line2>
      </Top>
    </Container>
  )
}

export default Header
const Container = styled.div`
    margin: 0 0 30px 300px;
`

const Top = styled.div`
    display:flex;
    flex-direction: column;
    align-items: start;
    height: 80px;
    background-color: ${({ theme }) => theme.colors.card};
    border : 1px solid ${({ theme }) => theme.colors.border};
    padding: 10px;
    gap: 10px
`

const Line1 = styled.div`
    font-size: ${({ theme }) => theme.fontSizes['xl']};
    font-weight: 600;
`

const Line2 = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};;
    color: ${({ theme }) => theme.colors.gray[400]};
`