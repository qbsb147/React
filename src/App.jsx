import { useState } from 'react';
import './App.css';
import User from './pages/Users/User.jsx';
import Overview from './pages/Overview/Overview';
import Event from './pages/Events/Event.jsx';
import Sidebar from './pages/Sidebar/Sidebar';
import List from './pages/Shop/List.jsx';
import Detail from './pages/Shop/Detail.jsx';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { ToastContainer } from 'react-toastify';
import DataFactory from './pages/DataFactory/DataFactory.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import {  baseTheme, lightTheme, darkTheme  } from './styles/tokens.js';
import { createStyledTheme } from './styles/styledTheme.js';
import { createMuiTheme } from './styles/muiTheme.js';


function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);
  const theme = {
    ...baseTheme,
    colors: isDark ? darkTheme.colors : lightTheme.colors
  }
  return (
    <StyledThemeProvider theme={createStyledTheme(theme)}>
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <BrowserRouter>
          <GlobalStyle />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Sidebar onToggleTheme={toggleTheme} isDark={isDark} />
          <Center>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/users" element={<User />} />
              <Route path="/events" element={<Event />} />
              <Route path="/shop" element={<List />} />
              <Route path="/shop/:detail" element={<Detail />} />
              <Route path="/data" element={<DataFactory />} />
            </Routes>
          </Center>
          </LocalizationProvider>
          <ToastContainer />
        </BrowserRouter>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;

const Center = styled.div`
  margin-left: 300px;
`;
