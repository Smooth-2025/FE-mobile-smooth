import { useTheme } from '@emotion/react';
import { Theme } from '@styles/theme';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import * as Styled from './Button.styles';

interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  bgColor?: string;
  textColor?: string;
  style?: object;
}

export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  bgColor,
  textColor,
  style,
  ...props
}: ButtonProps) => {
  const theme = useTheme() as Theme;

  return (
    <Styled.ButtonWrapper
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor:
            bgColor ?? (disabled ? theme.colors.neutral200 : theme.colors.primary600),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor ?? theme.colors.white} />
      ) : (
        <Styled.ButtonText style={{ color: textColor ?? theme.colors.white }} {...props}>
          {label}
        </Styled.ButtonText>
      )}
    </Styled.ButtonWrapper>
  );
};
