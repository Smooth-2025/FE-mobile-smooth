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

const ErrorText = styled(Text)`
  color: ${theme.colors.danger600};
  font-size: 12px;
  margin-top: 4px;
`;

const GenderSection = styled.View`
  margin-bottom: 20px;
`;

const GenderLabel = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.neutral600};
  margin-bottom: 8px;
  font-family: ${theme.typography.fonts.pretendard.medium};
`;

const GenderButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ selected }) => (selected ? theme.colors.primary600 : theme.colors.neutral300)};
  background-color: ${({ selected }) => (selected ? theme.colors.primary50 : theme.colors.white)};
  align-items: center;
`;

const GenderButtonText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? theme.colors.primary600 : theme.colors.neutral500)};
  font-size: 16px;
`;

const NextButton = styled(Button)`
  margin-top: 30px;
`;

const PersonalInfoScreen = () => {
  const navigation = useNavigation() as any;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [genderError, setGenderError] = useState('성별을 선택해주세요');

  // 유효성 검사
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('이름을 다시 확인해주세요');
    } else {
      setNameError('');
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('휴대폰 번호를 다시 확인해주세요');
    } else {
      setPhoneError('');
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (text.length > 0) {
      validateName(text);
    } else {
      setNameError('');
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (text.length > 0) {
      validatePhone(text);
    } else {
      setPhoneError('');
    }
  };

  const isFormValid = name.trim() && !nameError && phone && !phoneError && gender;

  const handleNext = () => {
    // 최종 유효성 검사
    if (!name.trim()) {
      setNameError('이름을 다시 확인해주세요');
    }
    if (!phone) {
      setPhoneError('휴대폰 번호를 다시 확인해주세요');
    } else {
      validatePhone(phone);
    }
    if (!gender) {
      setGenderError('성별을 선택해주세요');
    }

    if (!isFormValid) {
      Toast.show({
        type: 'error',
        text1: '입력 정보를 확인해주세요',
        position: 'bottom',
      });
      return;
    }

    navigation.navigate('Terms');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon>← 뒤로가기</BackIcon>
        </BackButton>
      </Header>

      <ProgressBar currentStep={2} totalSteps={4} />

      <Title>이름을 입력해주세요</Title>

      <Input
        label='이름'
        value={name}
        onChangeText={handleNameChange}
        placeholder='이름을 입력해주세요'
      />
      {nameError ? <ErrorText>{nameError}</ErrorText> : null}

      <Input
        label='휴대폰 번호'
        value={phone}
        onChangeText={handlePhoneChange}
        placeholder='01012345678'
        keyboardType='number-pad'
      />
      {phoneError ? <ErrorText>{phoneError}</ErrorText> : null}

      <GenderSection>
        <GenderLabel>성별</GenderLabel>
        <GenderButtonContainer>
          <GenderButton
            selected={gender === 'male'}
            onPress={() => {
              setGender('male');
              setGenderError('');
            }}
          >
            <GenderButtonText selected={gender === 'male'}>남성</GenderButtonText>
          </GenderButton>
          <GenderButton
            selected={gender === 'female'}
            onPress={() => {
              setGender('female');
              setGenderError('');
            }}
          >
            <GenderButtonText selected={gender === 'female'}>여성</GenderButtonText>
          </GenderButton>
        </GenderButtonContainer>
        {genderError ? <ErrorText>{genderError}</ErrorText> : null}
      </GenderSection>

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

export default PersonalInfoScreen;
