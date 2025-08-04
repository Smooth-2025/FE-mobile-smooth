import { Button, Input, Text } from '@components/common';
import styled from '@emotion/native';
import { theme } from '@styles/theme';
import React, { useState } from 'react';

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Title = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 60px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const ErrorText = styled(Text)`
  color: ${theme.colors.danger600};
  font-size: 12px;
  margin-top: 4px;
`;

const LoginButton = styled(Button)`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const SignupButton = styled.TouchableOpacity`
  align-items: center;
  padding: 10px;
`;

const SignupText = styled(Text)`
  color: ${theme.colors.neutral500};
  font-size: 14px;
`;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('이메일을 확인해주세요');
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

  return (
    <ContentWrapper>
      <Title>smooth</Title>

      <InputContainer>
        <Input
          label='이메일'
          value={email}
          onChangeText={handleEmailChange}
          placeholder='이메일을 입력해주세요'
          keyboardType='email-address'
        />
        {emailError ? <ErrorText>{emailError}</ErrorText> : null}
      </InputContainer>

      <InputContainer>
        <Input
          label='비밀번호'
          value={password}
          onChangeText={setPassword}
          placeholder='비밀번호를 입력해주세요'
          secureTextEntry
        />
      </InputContainer>

      <LoginButton
        label='로그인'
        onPress={() => console.log('로그인 클릭!', { email, password })}
        bgColor={theme.colors.primary600}
      />

      <SignupButton onPress={() => console.log('회원가입 페이지로 이동!')}>
        <SignupText>이메일로 가입하기</SignupText>
      </SignupButton>
    </ContentWrapper>
  );
};

export default LoginScreen;
