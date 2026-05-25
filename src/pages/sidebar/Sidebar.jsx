import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa';
import styled from 'styled-components';

const Sidebar = ({ onToggleTheme }) => {
  return (
    <Container>
      
      <ToggleButton onClick={onToggleTheme}>
        <FaSun /> / <FaMoon />
        <br /> 테마 토글
      </ToggleButton>
    </Container>
  )
}

export default Sidebar
const Container = styled.div`
  width: 200px;
  min-height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 5;
  background: ${({ theme }) => theme.faint};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.button`
  width: 100%;
  margin-top: auto;
  position: relative;
  display: inline-block;
  color: ${({ theme }) => theme.text};
  font-size: 27px;
  padding: 10px 20px;
  border: 0 solid;
  outline: 1px solid;
  outline-color: ${({ theme }) => theme.contrasting05};
  outline-offset: 0px;
  text-shadow: none;
  transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
  align-self: center;

  &:hover {
    width: 80%;
    margin-bottom: 15px;
    border: 1px solid;
    box-shadow:
      inset 0 0 20px ${({ theme }) => theme.contrasting05},
      0 0 20px ${({ theme }) => theme.contrasting02};
    outline-color: ${({ theme }) => theme.contrasting00};
    outline-offset: 15px;
    text-shadow: 1px 1px 2px ${({ theme }) => theme.base05};
  }
`;
