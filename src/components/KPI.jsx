import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { IconArrowUp } from '@tabler/icons-react';

export const KPI = ({title, value, content, diff, color = 'default' }) => {
  const status = diff?.startsWith('-') ? 'down' : 'up';
  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    return value.toLocaleString();
  };
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Value>{formatNumber(value)}</Value>
      <Delta style={{ color: status==='up'?"#3FB950": "#F85149"}}>
        <IconArrowUp size={16} />
        <TextGroup  style={{ gap: "1px"}}>
          <Content status={status}>{content}</Content>
          <Diff status={status}>{diff}</Diff>          
        </TextGroup >
      </Delta>
    </Container>
  )
}

export default KPI

const Container = styled.div`
    padding: 12px 14px; 
    position: relative; 
    overflow: hidden; 
    border: 0.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.xl};;
    width: 130px;
    height: 110px;
    background: ${({ theme }) => theme.colors.card};;
    padding: 12px 14px;
    overflow: hidden;
    &::before {
      content: '';
      position:absolute; 
      top:0; 
      left:0; 
      right:0; 
      height:4px; 
      background: #185FA5; 
      border-radius: 4px 4px 0 0; 
      ${({ color }) =>
        color === 'green' &&
        css`
          background: #3B6D11;
        `}

      ${({ color }) =>
        color === 'coral' &&
        css`
          background: #993C1D;
        `}

      ${({ color }) =>
        color === 'amber' &&
        css`
          background: #BA7517;
        `}
    }
`
const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
`

const Value = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
  display: flex;
  margin-bottom: 10px;
`

const Content = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  ${({ status }) =>
    status === 'up' &&
    css`
      color: #3FB950;
    `}

  ${({ status }) =>
    status === 'down' &&
    css`
      color: #F85149;
    `}
`
const Diff = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  display: flex;
`

const Delta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  display: flex;
  align-items: center;
  gap: 3px;
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;