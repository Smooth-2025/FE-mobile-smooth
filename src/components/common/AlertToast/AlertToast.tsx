import { theme } from '@/styles/theme';
import React from 'react';
import { Animated, Easing } from 'react-native';
import { Icon } from '../Icons';
import * as Styled from './AlertToast.styles';
import { ToastIconType, ToastProps, ToastType } from './type';

const AnimatedToastContainer = Animated.createAnimatedComponent(Styled.ToastContainer);
const styleMap: Record<
  ToastType,
  {
    bg: string;
    border: string;
    text: string;
    icon: ToastIconType;
    iconColor: string;
  }
> = {
  success: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'checkmarkCircle',
    iconColor: theme.colors.primary600,
  },
  error: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'warningCircle',
    iconColor: theme.colors.danger600,
  },
  'accident-nearby': {
    bg: theme.colors.danger200,
    border: theme.colors.danger700,
    text: theme.colors.neutral600,
    icon: 'warningCircle',
    iconColor: theme.colors.danger700,
  },
  obstacle: {
    bg: theme.colors.neutral50,
    border: theme.colors.neutral500,
    text: theme.colors.neutral600,
    icon: 'warningTriangle',
    iconColor: theme.colors.neutral500,
  },
  pothole: {
    bg: theme.colors.Warning200,
    border: theme.colors.Warning600,
    text: theme.colors.neutral600,
    icon: 'warningTriangle',
    iconColor: theme.colors.Warning600,
  },
} as const;

export default function AlertToast({
  type,
  title,
  content,
  position = 'bottom',
  duration = 3000,
}: ToastProps) {
  const { bg, border, text, icon, iconColor } = styleMap[type];

  const [visible, setVisible] = React.useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim]);

  if (!visible) return null;

  return (
    <AnimatedToastContainer
      bg={bg}
      border={border}
      position={position}
      style={{ opacity: fadeAnim }}
    >
      <Styled.IconWrapper>
        <Icon name={icon} color={iconColor} />
      </Styled.IconWrapper>
      <Styled.ContentWrapper>
        {title && <Styled.ToastTitle color={text}>{title}</Styled.ToastTitle>}
        <Styled.ToastContent color={text}>{content}</Styled.ToastContent>
      </Styled.ContentWrapper>
    </AnimatedToastContainer>
  );
}
