import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import User from './pages/users/User.jsx'
import Overview from './pages/overview/Overview'
import Event from './pages/events/Event.jsx'
import Sidebar from './pages/sidebar/Sidebar'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from './GlobalStyle';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Router>
        <Sidebar>
          <Center>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/user_analytics" element={<User />} />
              <Route path="/event_analytics" element={<Event />} />
            </Routes>
          </Center>
        </Sidebar>
      </Router>
    </BrowserRouter>
  )
}

export default App

const Center = styled.div`
  margin-left: 200px;
`;
