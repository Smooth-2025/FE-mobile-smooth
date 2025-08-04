import { Button, Input, ProgressBar, Text } from '@components/common';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@styles/theme';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 40px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 10px;
`;

const BackIcon = styled(Text)`
  font-size: 18px;
  color: ${theme.colors.neutral600};
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const ValidationText = styled(Text)<{ isValid: boolean }>`
  color: ${({ isValid }) => (isValid ? theme.colors.success600 : theme.colors.danger600)};
  font-size: 12px;
  margin-top: 4px;
`;

const NextButton = styled(Button)`
  margin-top: 20px;
`;

const PasswordScreen = () => {
  const navigation = useNavigation() as any;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 비밀번호 유효성 검사
  const isPasswordValid = password.length >= 8 && password.length <= 16;
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && isPasswordMatch;

  const handleNext = () => {
    if (!isFormValid) {
      Toast.show({
        type: 'error',
        text1: '입력 정보를 확인해주세요',
        position: 'bottom',
      });
      return;
    }

    navigation.navigate('PersonalInfo');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon>← 뒤로가기</BackIcon>
        </BackButton>
      </Header>

      <ProgressBar currentStep={2} totalSteps={4} />

      <Title>비밀번호를 입력해주세요</Title>

      <Input
        label='비밀번호'
        value={password}
        onChangeText={setPassword}
        placeholder='비밀번호를 입력해주세요'
        secureTextEntry
      />
      <ValidationText isValid={isPasswordValid}>
        {password.length > 0
          ? isPasswordValid
            ? '사용가능한 비밀번호 입니다.'
            : '비밀번호 8~16자를 입력해주세요.'
          : ''}
      </ValidationText>

      <Input
        label='비밀번호 확인'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder='비밀번호를 다시 입력해주세요'
        secureTextEntry
      />
      <ValidationText isValid={isPasswordMatch}>
        {confirmPassword.length > 0
          ? isPasswordMatch
            ? '비밀번호가 일치합니다.'
            : '비밀번호가 일치하지 않습니다.'
          : ''}
      </ValidationText>

      <NextButton
        label='다음'
        onPress={handleNext}
        bgColor={isFormValid ? theme.colors.primary600 : theme.colors.neutral200}
        textColor={isFormValid ? theme.colors.white : theme.colors.neutral400}
        disabled={!isFormValid}
      />
    </Container>
  );
};

export default PasswordScreen;
