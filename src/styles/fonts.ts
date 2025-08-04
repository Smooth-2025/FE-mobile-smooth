import { Platform } from 'react-native';

export type FontWeight =
  | 'thin' // 100
  | 'extraLight' // 200
  | 'light' // 300
  | 'regular' // 400
  | 'medium' // 500
  | 'semiBold' // 600
  | 'bold' // 700
  | 'extraBold' // 800
  | 'black'; // 900
export type FontFamily = 'system' | 'pretendard';

export const fontFamilies = {
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }) as string,
  pretendard: Platform.select({
    ios: 'Pretendard',
    android: 'Pretendard-Regular',
  }) as string,
} as const;

const fontWeightMap = {
  pretendard: {
    thin: 'Pretendard-Thin',
    extraLight: 'Pretendard-ExtraLight',
    light: 'Pretendard-Light',
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    semiBold: 'Pretendard-SemiBold',
    bold: 'Pretendard-Bold',
    extraBold: 'Pretendard-ExtraBold',
    black: 'Pretendard-Black',
  },
} as const;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getFontFamily = (
  family: FontFamily = 'pretendard',
  weight: FontWeight = 'regular'
): string => {
  const defaultPretendard = 'Pretendard-Regular';

  if (family === 'system') {
    return Platform.select({ ios: 'System', android: 'Roboto' })!;
  }

  return `Pretendard-${capitalize(weight)}` || defaultPretendard;
};

export const fonts = {
  pretendard: {
    thin: getFontFamily('pretendard', 'thin'), // 100
    extraLight: getFontFamily('pretendard', 'extraLight'), // 200
    light: getFontFamily('pretendard', 'light'), // 300
    regular: getFontFamily('pretendard', 'regular'), // 400 (기본)
    medium: getFontFamily('pretendard', 'medium'), // 500
    semiBold: getFontFamily('pretendard', 'semiBold'), // 600
    bold: getFontFamily('pretendard', 'bold'), // 700
    extraBold: getFontFamily('pretendard', 'extraBold'), // 800
    black: getFontFamily('pretendard', 'black'), // 900
  },
  system: fontFamilies.system,
} as const;

export const fontWeightNumbers = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;
