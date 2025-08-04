import { theme } from '@styles/theme';
import React from 'react';
import { TextInputProps } from 'react-native';
import * as Styled from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function Input(props: InputProps) {
  const { label, value, onChangeText, ...restProps } = props;

  return (
    <Styled.Wrapper>
      {label && <Styled.StyledLabel>{label}</Styled.StyledLabel>}
      <Styled.StyledTextInput
        {...restProps}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.neutral400}
        underlineColorAndroid='transparent'
      />
    </Styled.Wrapper>
  );
}
