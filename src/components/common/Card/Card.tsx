import React from 'react';
import { ViewProps } from 'react-native';
import * as Styled from './Card.styles';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  radius = 'md',
  backgroundColor,
  borderColor,
  children,
  style,
  ...props
}) => {
  return (
    <Styled.Card
      variant={variant}
      padding={padding}
      radius={radius}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      style={style}
      {...props}
    >
      {children}
    </Styled.Card>
  );
};
