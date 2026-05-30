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
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import DataFactory from './pages/DataFactory/DataFactory.jsx'

function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <BrowserRouter>
        <GlobalStyle />
        <Sidebar onToggleTheme={toggleTheme} />
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
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

const Center = styled.div`
  margin-left: 200px;
`;
