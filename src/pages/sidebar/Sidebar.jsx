import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import styled from 'styled-components';
import barChartImg from '../../assets/barChart.png'
import { FaBagShopping } from "react-icons/fa6";
import { IconLayoutDashboard } from '@tabler/icons-react';
import { FiUsers } from "react-icons/fi";
import { GoZap } from "react-icons/go";
import { HiOutlineFilter } from "react-icons/hi";
import { DateTimePicker } from '@mui/x-date-pickers';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const Sidebar = ({ onToggleTheme, isDark }) => {
  const [endDate,setEndDate] = useState(dayjs());
  const [startDate,setStartDate] = useState(dayjs().subtract(1,'M'));
  const [eventChecked, setEventChecked] = useState({
    view : true,
    click : true,
    purchase : true,
  })
  const [userChecked, setUserChecked] = useState({
    newUser : true,
    existingUser : true,
  })

  const eventValues = Object.values(eventChecked);
  const userValues = Object.values(userChecked);

  const checkHandle = ({key, checked, setChecked}) => {
    if(key==='all'){
      const allChecked = Object.values(checked).every(Boolean);
      setChecked(
        Object.fromEntries(
          Object.keys(checked).map(key => [key, !allChecked]),
        )
      )
      return;
    }
    setChecked(prev =>({
      ...prev,
      [key] : !prev[key],
    }));
  }

  const eventChk = (
    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
      <FormControlLabel
        label="노출"
        control={<Checkbox checked={eventChecked.view} onChange={() => checkHandle({key: 'view', checked : eventChecked, setChecked : setEventChecked})} />}
      />
      <FormControlLabel
        label="조회"
        control={<Checkbox checked={eventChecked.click} onChange={() => checkHandle({key: 'click', checked : eventChecked, setChecked : setEventChecked})} />}
      />
      <FormControlLabel
        label="구매"
        control={<Checkbox checked={eventChecked.purchase} onChange={() => checkHandle({key: 'purchase', checked : eventChecked, setChecked : setEventChecked})} />}
      />
    </Box>
  )

  const userChk = (
    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
      <FormControlLabel
        label="신규 사용자"
        control={<Checkbox checked={userChecked.newUser} onChange={() => checkHandle({key : 'newUser', checked : userChecked, setChecked : setUserChecked})} />}
      />
      <FormControlLabel
        label="기존 사용자"
        control={<Checkbox checked={userChecked.existingUser} onChange={() => checkHandle({key : 'existingUser', checked : userChecked, setChecked : setUserChecked})} />}
      />
    </Box>
  )

  return (
    <Container>
      <Top>
        <Logo src={barChartImg} alt="Logo"></Logo>
        <Title>쇼핑몰 분석</Title>
        <Button onClick={()=>onToggleTheme()}>
          {isDark? <MdOutlineDarkMode /> : <CiLight />}
        </Button>
      </Top>
      <Menu>
        <SubTitle>메뉴</SubTitle>
        <Page>
          <Link to="/">
            <Item>
                <IconLayoutDashboard />
                <Content>Overview</Content>
            </Item>
          </Link>
          <Link to="/users">
            <Item>
              <FiUsers/>
              <Content>사용자 분석</Content>
            </Item>
          </Link>
          <Link to="/evnets">
            <Item>
              <GoZap />
              <Content>이벤트 분석</Content>
            </Item>
          </Link>
          <Link to="/shop">
            <Item>
              <FaBagShopping />
              <Content>쇼핑몰</Content>
            </Item>
          </Link>
        </Page>
      </Menu>
      <Filter>
      <SubTitle><HiOutlineFilter /> 필터</SubTitle>
          <Text> 날짜 범위</Text>
          <DateTimePicker 
            label="시작 시점"
            name="start"
            defaultValue={startDate}
            onChange={(newValue)=>setStartDate(newValue)}
            maxDateTime={endDate}
            slotProps={{
              textField:{
                variant: 'filled',
                focused: true,
                sx: {
                  color: (param) => param.palette.secondary.main,
                },
              },
              openPickerButton: {
                sx: {
                  color: (param) => param.palette.secondary.main,
                },
              },
            }}
          />
          <DateTimePicker 
            label="종류 시점"
            name="end"
            defaultValue={endDate}
            onChange={(newValue)=>setEndDate(newValue)}
            disableFuture
            slotProps={{
              textField:{
                variant: 'filled',
                focused: true,
                sx: {
                  color: (param) => param.palette.secondary.main,
                },
              },
              openPickerButton: {
                sx: {
                  color: (param) => param.palette.secondary.main,
                },
              },
            }}
          />
          <div>
          </div>
          <div>
          <Text>이벤트 타입</Text>
          <FormGroup>
            <FormControlLabel 
              label="전체선택"
              control={
                <Checkbox
                  checked={eventChecked.view && eventChecked.click && eventChecked.purchase}
                  indeterminate={!eventValues.every(Boolean)&&!eventValues.every(v=>!v)}
                  onChange={() => checkHandle({key: 'all', checked : eventChecked, setChecked : setEventChecked})}
                />
              }
            />
            {eventChk}
          </FormGroup>
          </div>
          <div>
          <Text>사용자 그룹</Text>
          <FormGroup>
            <FormControlLabel 
              label="전체선택"
              control={
                <Checkbox
                  checked={userChecked.newUser && userChecked.existingUser}
                  indeterminate={!userValues.every(Boolean)&&!userValues.every(v=>!v)}
                  onChange={() => checkHandle({key : 'all', checked : userChecked, setChecked : setUserChecked})}
                />
              }
            />
            {userChk}
          </FormGroup>
          </div>
        </Filter>
        <Button size="small" variant="outlined">초기화</Button>
    </Container>
  );
};

export default Sidebar;

const SubTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: flex;
  align-items: center;
  font-weight: 600;
  gap: 5px;
`

const Filter = styled.div`
  width: 100%;
  height: 40%;
  display:flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 10px 0px;
`

const Page = styled.div`
  width: 100%;
  height: 40%;
  padding: 0px, 20px;
`

const Item = styled.button`
  width: 100%;
  height: 40px;
  margin: 30px, 0px;
  background-color: transparent;
  display: flex;
  align-items: center;
  border: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
  &:active, &:focus{
    background: ${({ theme }) => theme.colors.activeNav};
    color: ${({ theme }) => theme.colors.text.active};
  }
  gap: 10px;
`

const Content = styled.div``
const Menu = styled.div`
  margin : 15px 15px 0px 15px;
`
const Text = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  display: flex;
  align-items: center;
`
const Top = styled.div`
  height: 60px;
  width: 100%;
  align-content: center;
  display: flex;
  border-bottom : 1px solid ${({ theme }) => theme.colors.border};
`

const Logo = styled.img`
  height: 40px;
  width: 40px;
  padding: 6px;
  margin: 10px 10px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  align-self: center;
`

const Title = styled.span`
  align-self: center;
  width: 100%;
  display:flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const Container = styled.div`
  width: 300px;
  min-height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 5;
  background: ${({ theme }) => theme.faint};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

