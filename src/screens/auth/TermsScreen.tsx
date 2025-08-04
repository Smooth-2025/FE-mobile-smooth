// src/screens/auth/TermsScreen.tsx 전체 수정
import { Button, ProgressBar, Text } from '@components/common';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@styles/theme';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
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

const CheckboxText = styled(Text)`
  flex: 1;
  font-size: 16px;
  color: ${theme.colors.neutral700};
`;

const TermsContainer = styled.View`
  flex: 1;
  margin: 20px 0;
`;

const TermsBox = styled.View`
  background-color: ${theme.colors.neutral50};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  max-height: 150px;
`;

const TermsTitle = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.primary600};
  margin-bottom: 8px;
`;

const TermsContent = styled(Text)`
  font-size: 12px;
  color: ${theme.colors.neutral600};
  line-height: 18px;
`;

const ConfirmButton = styled(Button)`
  margin-top: 20px;
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

  const handleConfirm = () => {
    if (!isFormValid) {
      Toast.show({
        type: 'error',
        text1: '필수 약관에 동의해주세요',
        position: 'bottom',
      });
      return;
    }

    console.log('응급정보 입력 페이지로 이동!');
    // TODO: 응급정보 입력 페이지로 이동
    // navigation.navigate('EmergencyInfo');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon>←</BackIcon>
        </BackButton>
      </Header>

      <ProgressBar currentStep={3} totalSteps={4} />

      <Title>약관에 동의해주세요</Title>

      <CheckboxRow onPress={handleAllAgree}>
        <CheckboxIcon checked={allAgreed}>{allAgreed && <CheckIcon>✓</CheckIcon>}</CheckboxIcon>
        <CheckboxText>약관 전체 동의</CheckboxText>
      </CheckboxRow>

      <TermsContainer>
        <TermsBox>
          <TermsTitle>이용약관 (필수)</TermsTitle>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TermsContent>
              제1조 (목적) 이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와 회원간의
              권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.{'\n\n'}
              제2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.{'\n'}
              1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.{'\n'}
              2. "회원"이라 함은 회사와 서비스 이용계약을 체결한 자를 의미합니다.{'\n\n'}
              제3조 (약관의 효력 및 변경) 이 약관은 서비스 화면에 게시하여 공시합니다.
            </TermsContent>
          </ScrollView>
        </TermsBox>

        <CheckboxRow onPress={handleTermsAgree}>
          <CheckboxIcon checked={termsAgreed}>
            {termsAgreed && <CheckIcon>✓</CheckIcon>}
          </CheckboxIcon>
          <CheckboxText>이용약관 (필수)</CheckboxText>
        </CheckboxRow>

        <TermsBox>
          <TermsTitle>개인정보처리방침 (필수)</TermsTitle>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TermsContent>
              개인정보보호법에 따라 회사는 개인정보 처리방침을 정하여 이용자 권익 보호에 최선을
              다하고 있습니다.{'\n\n'}
              1. 개인정보의 처리 목적{'\n'}- 회원 가입의사 확인, 회원제 서비스 제공{'\n'}- 본인
              식별·인증, 회원자격 유지·관리{'\n\n'}
              2. 개인정보의 처리 및 보유 기간{'\n'}- 회원탈퇴시까지{'\n'}- 단, 관계법령 위반에 따른
              수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지
            </TermsContent>
          </ScrollView>
        </TermsBox>

        <CheckboxRow onPress={handlePrivacyAgree}>
          <CheckboxIcon checked={privacyAgreed}>
            {privacyAgreed && <CheckIcon>✓</CheckIcon>}
          </CheckboxIcon>
          <CheckboxText>개인정보처리방침 (필수)</CheckboxText>
        </CheckboxRow>
      </TermsContainer>

      <ConfirmButton
        label='확인'
        onPress={handleConfirm}
        bgColor={isFormValid ? theme.colors.primary600 : theme.colors.neutral200}
        textColor={isFormValid ? theme.colors.white : theme.colors.neutral400}
        disabled={!isFormValid}
      />
    </Container>
  );
};

export default TermsScreen;
