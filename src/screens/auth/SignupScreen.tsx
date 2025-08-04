import { Button, Input, Text } from '@components/common';
import styled from '@emotion/native';
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

const Subtitle = styled(Text)`
  color: ${theme.colors.neutral500};
  font-size: 14px;
  margin-bottom: 30px;
`;

const ErrorText = styled(Text)`
  color: ${theme.colors.danger600};
  font-size: 12px;
  margin-top: 4px;
`;

const ConfirmButton = styled(Button)`
  margin-top: 20px;
`;

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('이메일을 다시 확인해주세요');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      validateEmail(text);
    } else {
      setEmailError('');
    }
  };

  const handleConfirm = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: '이메일을 입력해주세요',
        position: 'bottom',
      });
      return;
    }

    if (emailError) {
      Toast.show({
        type: 'error',
        text1: '이메일 형식을 확인해주세요',
        position: 'bottom',
      });
      return;
    }

    // 임시로 성공 메시지
    Toast.show({
      type: 'success',
      text1: '회원가입이 완료되었습니다!',
      position: 'bottom',
    });
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => console.log('뒤로가기')}>
          <BackIcon>←</BackIcon>
        </BackButton>
      </Header>

      <Title>이메일을 입력해주세요</Title>
      <Subtitle>로그인에 사용할 이메일입니다</Subtitle>

      <Input
        label='이메일'
        value={email}
        onChangeText={handleEmailChange}
        placeholder='이메일을 입력해주세요'
        keyboardType='email-address'
      />
      {emailError ? <ErrorText>{emailError}</ErrorText> : null}

      <ConfirmButton label='확인' onPress={handleConfirm} bgColor={theme.colors.primary600} />
    </Container>
  );
};

export default SignupScreen;
