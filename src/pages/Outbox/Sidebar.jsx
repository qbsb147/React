import React from 'react';
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
import { useFilterStore } from '../../store/filterStore'

const Sidebar = ({ onToggleTheme, isDark }) => {
  const {
  startTime, 
  setStartTime, 
  endTime, 
  setEndTime, 
  events, 
  setEvents, 
  users, 
  setUsers
  } = useFilterStore()
  const eventValues = Object.values(events);
  const userValues = Object.values(users);

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
  const init = () => {
    setEvents(
      Object.fromEntries(
        Object.keys(events).map(key => [key, true]),
      )
    );
    setUsers(
      Object.fromEntries(
        Object.keys(users).map(key => [key, true]),
      )
    );
    setStartTime(dayjs().subtract(1,'M'));
    setEndTime(dayjs());
  }

  const eventChk = (
    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
      <FormControlLabel
        label="조회"
        control={<Checkbox checked={events.view} onChange={() => checkHandle({key: 'view', checked : events, setChecked : setEvents})} />}
      />
      <FormControlLabel
        label="방문"
        control={<Checkbox checked={events.click} onChange={() => checkHandle({key: 'click', checked : events, setChecked : setEvents})} />}
      />
      <FormControlLabel
        label="구매"
        control={<Checkbox checked={events.purchase} onChange={() => checkHandle({key: 'purchase', checked : events, setChecked : setEvents})} />}
      />
    </Box>
  )

  const userChk = (
    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
      <FormControlLabel
        label="신규 회원"
        control={<Checkbox checked={users.newUser} onChange={() => checkHandle({key : 'newUser', checked : users, setChecked : setUsers})} />}
      />
      <FormControlLabel
        label="기존 회원"
        control={<Checkbox checked={users.existingUser} onChange={() => checkHandle({key : 'existingUser', checked : users, setChecked : setUsers})} />}
      />
    </Box>
  )

  return (
    <Container>
      <Top>
        <Logo src={barChartImg} alt="Logo"></Logo>
        <div className='title'>쇼핑몰 분석</div>
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
          <Link to="/events">
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
            defaultValue={startTime}
            value={startTime}
            onChange={(newValue)=>setStartTime(newValue)}
            maxDateTime={endTime}
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
            defaultValue={endTime}
            value={endTime}
            onChange={(newValue)=>setEndTime(newValue)}
            minDateTime={startTime}
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
                  checked={events.view && events.click && events.purchase}
                  indeterminate={!eventValues.every(Boolean)&&!eventValues.every(v=>!v)}
                  onChange={() => checkHandle({key: 'all', checked : events, setChecked : setEvents})}
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
                  checked={users.newUser && users.existingUser}
                  indeterminate={!userValues.every(Boolean)&&!userValues.every(v=>!v)}
                  onChange={() => checkHandle({key : 'all', checked : users, setChecked : setUsers})}
                />
              }
            />
            {userChk}
          </FormGroup>
          </div>
        </Filter>
        <Button size="small" variant="outlined" onClick={init}>초기화</Button>
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
  padding: 0px 20px;
`

const Item = styled.button`
  width: 100%;
  height: 40px;
  margin: 10px 0px;
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

