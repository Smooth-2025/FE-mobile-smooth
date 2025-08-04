import styled from '@emotion/native';
import { theme } from '@styles/theme';
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const Container = styled.View`
  margin-bottom: 30px;
`;

const BarContainer = styled.View`
  height: 4px;
  background-color: ${theme.colors.neutral200};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: ${theme.colors.primary600};
  border-radius: 2px;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  console.log('Progress:', progress);

  return (
    <Container>
      <BarContainer>
        <ProgressFill style={{ width: `${progress}%` }} />
      </BarContainer>
    </Container>
  );
};
