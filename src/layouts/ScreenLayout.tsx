import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Theme } from '@styles/theme';
import React, { PropsWithChildren } from 'react';

interface ScreenLayoutProps {
  bgColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

const ScreenLayout = ({
  bgColor,
  children,
  paddingHorizontal = 16,
  paddingVertical = 0,
}: PropsWithChildren<ScreenLayoutProps>) => {
  const theme = useTheme() as Theme;
  return (
    <Wrapper
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      paddingTop={paddingVertical}
      paddingBottom={paddingVertical}
      bgColor={bgColor ?? theme.colors.bg_page}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.View<{
  paddingHorizontal: number;
  paddingVertical: number;
  paddingTop: number;
  paddingBottom: number;
  bgColor: string;
}>`
  flex: 1;
  padding: ${({ paddingVertical }) => paddingVertical}px
    ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  background-color: ${({ bgColor }) => bgColor};
`;

export default ScreenLayout;
