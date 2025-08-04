import { Button, Input, Text } from '@components/common';
import styled from '@emotion/native';
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
  margin-bottom: 40px;
`;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ContentWrapper>
      <Title>smooth</Title>

      <Input
        label='이메일'
        value={email}
        onChangeText={setEmail}
        placeholder='이메일을 입력해주세요'
        keyboardType='email-address'
      />

      <Input
        label='비밀번호'
        value={password}
        onChangeText={setPassword}
        placeholder='비밀번호를 입력해주세요'
        secureTextEntry
      />

      <Button label='로그인' onPress={() => console.log('로그인 클릭!')} />

      <Text style={{ textAlign: 'center', marginTop: 20 }}>이메일로 가입하기</Text>
    </ContentWrapper>
  );
};

export default LoginScreen;
