import styled from '@emotion/native';
import { Text, View } from 'react-native';
import { ToastPosition } from './type';

export const ToastContainer = styled(View)<{
  bg: string;
  border: string;
  position: ToastPosition;
}>`
  position: absolute;
  ${props => (props.position === 'top' ? 'top: 60px;' : 'bottom: 100px;')}
  left: 20px;
  right: 20px;
  background-color: ${props => props.bg};
  border-width: ${props => (props.border !== 'transparent' ? '2px' : '0px')};
  border-style: solid;
  border-color: ${props => props.border};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  z-index: 99999;
  elevation: 30;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;
export const IconWrapper = styled(View)`
  margin-right: 12px;
`;

export const ContentWrapper = styled(View)`
  flex: 1;
`;

export const ToastTitle = styled(Text)<{ color: string }>`
  font-weight: bold;
  font-size: 15px;
  color: ${props => props.color};
`;

export const ToastContent = styled(Text)<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  margin-top: 2px;
`;
