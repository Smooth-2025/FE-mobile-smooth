import { Button, ProgressBar, Text } from '@components/common';
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

const CheckboxContainer = styled.View`
  margin-bottom: 20px;
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
`;

const CheckboxIcon = styled.View<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid
    ${({ checked }) => (checked ? theme.colors.primary600 : theme.colors.neutral300)};
  background-color: ${({ checked }) => (checked ? theme.colors.primary600 : theme.colors.white)};
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled(Text)`
  color: ${theme.colors.white};
  font-size: 16px;
`;

const CheckboxText = styled(Text)<{ isMain?: boolean }>`
  flex: 1;
  font-size: ${({ isMain }) => (isMain ? '16px' : '14px')};
  font-weight: ${({ isMain }) => (isMain ? 'bold' : 'normal')};
  color: ${theme.colors.neutral700};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.neutral200};
  margin: 16px 0;
`;

const CompleteButton = styled(Button)`
  margin-top: 30px;
`;

const TermsScreen = () => {
  const navigation = useNavigation() as any;
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 전체 동의 처리
  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTermsAgreed(newValue);
    setPrivacyAgreed(newValue);
  };

  // 개별 동의 처리
  const handleTermsAgree = () => {
    const newValue = !termsAgreed;
    setTermsAgreed(newValue);
    checkAllAgreed(newValue, privacyAgreed);
  };

  const handlePrivacyAgree = () => {
    const newValue = !privacyAgreed;
    setPrivacyAgreed(newValue);
    checkAllAgreed(termsAgreed, newValue);
  };

  // 전체 동의 상태 체크
  const checkAllAgreed = (terms: boolean, privacy: boolean) => {
    setAllAgreed(terms && privacy);
  };

  const isFormValid = termsAgreed && privacyAgreed;

  const handleComplete = () => {
    if (!isFormValid) {
      Toast.show({
        type: 'error',
        text1: '필수 약관에 동의해주세요',
        position: 'bottom',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: '회원가입이 완료되었습니다!',
      position: 'bottom',
    });

    console.log('회원가입 완료!', {
      termsAgreed,
      privacyAgreed,
    });

    // TODO: 실제 회원가입 API 호출 후 로그인 페이지로 이동
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon>←</BackIcon>
        </BackButton>
      </Header>

      <ProgressBar currentStep={4} totalSteps={4} />

      <Title>약관에 동의해주세요</Title>

      <CheckboxContainer>
        <CheckboxRow onPress={handleAllAgree}>
          <CheckboxIcon checked={allAgreed}>{allAgreed && <CheckIcon>✓</CheckIcon>}</CheckboxIcon>
          <CheckboxText isMain>전체 동의</CheckboxText>
        </CheckboxRow>

        <Divider />

        <CheckboxRow onPress={handleTermsAgree}>
          <CheckboxIcon checked={termsAgreed}>
            {termsAgreed && <CheckIcon>✓</CheckIcon>}
          </CheckboxIcon>
          <CheckboxText>[필수] 이용약관에 동의</CheckboxText>
        </CheckboxRow>

        <CheckboxRow onPress={handlePrivacyAgree}>
          <CheckboxIcon checked={privacyAgreed}>
            {privacyAgreed && <CheckIcon>✓</CheckIcon>}
          </CheckboxIcon>
          <CheckboxText>[필수] 개인정보처리방침에 동의</CheckboxText>
        </CheckboxRow>
      </CheckboxContainer>

      <CompleteButton
        label='가입완료'
        onPress={handleComplete}
        bgColor={isFormValid ? theme.colors.primary600 : theme.colors.neutral200}
        textColor={isFormValid ? theme.colors.white : theme.colors.neutral400}
        disabled={!isFormValid}
      />
    </Container>
  );
};

export default TermsScreen;
