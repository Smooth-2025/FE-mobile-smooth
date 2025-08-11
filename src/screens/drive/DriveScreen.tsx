import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, Text } from '@components/common';
import styled from '@emotion/native';
import { theme } from '@styles/theme';
import AlertNotification from '../../components/alert/AlertNotification';
import WebSocketService from '../../services/websocket/WebSocketService';
import { AlertMessage, ConnectionStatus } from '../../services/websocket/types';
import api, { alertTestApi } from '../../apis';
import { useAppSelector } from '../../store';

export default function DriveScreen() {
  const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const userId = useAppSelector(state => state.user.userId); // Redux store에서 사용자 ID 가져오기

  useEffect(() => {
    // WebSocket 콜백 설정
    WebSocketService.setCallbacks({
      onAlert: (alert: AlertMessage) => {
        console.log('🚨 알림 수신:', alert);
        setCurrentAlert(alert);

        // 5초 후 자동으로 알림 닫기
        setTimeout(() => {
          setCurrentAlert(null);
        }, 5000);
      },
      onStatusChange: (status: ConnectionStatus) => {
        setConnectionStatus(status);
        console.log('🔌 연결 상태 변경:', status);
      },
      onConnect: () => {
        console.log('✅ WebSocket 연결 성공');
      },
      onDisconnect: () => {
        console.log('🛑 WebSocket 연결 해제');
      },
      onError: error => {
        console.error('❌ WebSocket 에러:', error);
      },
    });

    // 컴포넌트 마운트 시 자동 연결
    connectWebSocket();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      await WebSocketService.connect(userId);
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      Alert.alert('연결 실패', 'WebSocket 연결에 실패했습니다.');
    }
  };

  const sendTestAlert = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      const response = await alertTestApi.sendSimpleMessage(userId, '테스트 알림 메시지입니다!');
      console.log('테스트 알림 전송 성공:', response);
    } catch (error) {
      console.error('테스트 알림 전송 실패:', error);
      Alert.alert('전송 실패', '테스트 알림 전송에 실패했습니다.');
    }
  };

  const sendAccidentAlert = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      const response = await alertTestApi.testAccident(userId, 37.5665, 126.978);
      console.log('사고 알림 전송 성공:', response);
    } catch (error) {
      console.error('사고 알림 전송 실패:', error);
      Alert.alert('전송 실패', '사고 알림 전송에 실패했습니다.');
    }
  };

  const sendObstacleAlert = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      const response = await alertTestApi.testObstacle(userId, 37.5665, 126.978);
      console.log('장애물 알림 전송 성공:', response);
    } catch (error) {
      console.error('장애물 알림 전송 실패:', error);
      Alert.alert('전송 실패', '장애물 알림 전송에 실패했습니다.');
    }
  };

  const sendPotholeAlert = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      const response = await alertTestApi.testPothole(userId, 37.5665, 126.978);
      console.log('포트홀 알림 전송 성공:', response);
    } catch (error) {
      console.error('포트홀 알림 전송 실패:', error);
      Alert.alert('전송 실패', '포트홀 알림 전송에 실패했습니다.');
    }
  };

  const sendStartAlert = async () => {
    if (!userId) {
      Alert.alert('로그인 필요', '먼저 로그인해주세요.');
      return;
    }

    try {
      // 주행 시작은 간단한 메시지로 대체
      const response = await alertTestApi.sendSimpleMessage(userId, '주행을 시작합니다!');
      console.log('주행 시작 알림 전송 성공:', response);
    } catch (error) {
      console.error('주행 시작 알림 전송 실패:', error);
      Alert.alert('전송 실패', '주행 시작 알림 전송에 실패했습니다.');
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return '🟢 연결됨';
      case ConnectionStatus.CONNECTING:
        return '🟡 연결 중...';
      case ConnectionStatus.RECONNECTING:
        return '🟡 재연결 중...';
      case ConnectionStatus.ERROR:
        return '🔴 에러';
      default:
        return '⚪ 연결 안됨';
    }
  };

  return (
    <Container>
      {/* 알림 표시 */}
      {currentAlert && (
        <AlertNotification alert={currentAlert} onClose={() => setCurrentAlert(null)} />
      )}

      <ContentWrapper>
        <Title>주행 화면</Title>

        <StatusContainer>
          <StatusText>WebSocket 상태: {getConnectionStatusText()}</StatusText>
          <UserText>사용자 ID: {userId || '로그인 필요'}</UserText>
        </StatusContainer>

        <ButtonContainer>
          <TestButton 
            label="📢 테스트 알림" 
            onPress={sendTestAlert}
            bgColor={theme.colors.primary600}
          />

          <AccidentButton 
            label="🚨 사고 알림" 
            onPress={sendAccidentAlert}
            bgColor={theme.colors.danger600}
          />

          <ReconnectButton 
            label="🔌 재연결" 
            onPress={connectWebSocket}
            bgColor={theme.colors.neutral600}
          />

          <TestButton 
            label="⚠️ 장애물 알림" 
            onPress={sendObstacleAlert}
            bgColor={theme.colors.warning600}
          />

          <TestButton 
            label="🕳️ 포트홀 알림" 
            onPress={sendPotholeAlert}
            bgColor="#9c27b0"
          />

          <TestButton 
            label="🚦 주행 시작" 
            onPress={sendStartAlert}
            bgColor={theme.colors.success600}
          />

          <TestButton 
            label="🧪 강제 알림 테스트" 
            onPress={() => {
              console.log('🧪 강제 알림 테스트 시작');
              const testAlert: AlertMessage = {
                type: 'accident' as any,
                title: '강제 테스트 알림',
                content: '이것은 강제로 표시하는 테스트 알림입니다!'
              };
              setCurrentAlert(testAlert);
              console.log('🧪 강제 알림 설정 완료:', testAlert);
              setTimeout(() => setCurrentAlert(null), 5000);
            }}
            bgColor="#6c757d"
          />
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components (LoginScreen 스타일과 일관성 유지)
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.bg_page};
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.neutral900};
`;

const StatusContainer = styled.View`
  background-color: ${theme.colors.white};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 30px;
  shadow-color: ${theme.colors.neutral900};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const StatusText = styled(Text)`
  font-size: 16px;
  margin-bottom: 8px;
  color: ${theme.colors.neutral900};
  font-weight: 500;
`;

const UserText = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.neutral600};
`;

const ButtonContainer = styled.View`
  gap: 16px;
`;

const TestButton = styled(Button)`
  margin-bottom: 4px;
`;

const AccidentButton = styled(Button)`
  margin-bottom: 4px;
`;

const ReconnectButton = styled(Button)`
  margin-bottom: 4px;
`;
