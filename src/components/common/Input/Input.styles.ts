import styled from '@emotion/native';
import { theme } from '@styles/theme';

export const Wrapper = styled.View`
  margin-bottom: 16px;
`;

export const StyledLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.neutral600};
  margin-bottom: 8px;
  font-family: ${theme.typography.fonts.pretendard.medium};
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${theme.colors.neutral50};
  padding: 16px 20px;
  border-radius: ${theme.borderRadius.md}px;
  font-size: 16px;
  color: ${theme.colors.neutral600};
  font-family: ${theme.typography.fonts.pretendard.medium};
  include-font-padding: false;
  text-decoration-line: none;
`;
