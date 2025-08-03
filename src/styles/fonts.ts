import { Platform } from "react-native";

export type FontWeight =
  | "thin" // 100
  | "extraLight" // 200
  | "light" // 300
  | "regular" // 400
  | "medium" // 500
  | "semiBold" // 600
  | "bold" // 700
  | "extraBold" // 800
  | "black"; // 900
export type FontFamily = "system" | "pretendard";

export const fontFamilies = {
  system: Platform.select({
    ios: "System",
    android: "Roboto",
  }) as string,
  pretendard: Platform.select({
    ios: "Pretendard",
    android: "Pretendard-Regular",
  }) as string,
} as const;

const fontWeightMap = {
  pretendard: {
    thin: Platform.select({
      ios: "Pretendard-Thin",
      android: "Pretendard-Thin",
    }) as string,
    extraLight: Platform.select({
      ios: "Pretendard-ExtraLight",
      android: "Pretendard-ExtraLight",
    }) as string,
    light: Platform.select({
      ios: "Pretendard-Light",
      android: "Pretendard-Light",
    }) as string,
    regular: Platform.select({
      ios: "Pretendard-Regular",
      android: "Pretendard-Regular",
    }) as string,
    medium: Platform.select({
      ios: "Pretendard-Medium",
      android: "Pretendard-Medium",
    }) as string,
    semiBold: Platform.select({
      ios: "Pretendard-SemiBold",
      android: "Pretendard-SemiBold",
    }) as string,
    bold: Platform.select({
      ios: "Pretendard-Bold",
      android: "Pretendard-Bold",
    }) as string,
    extraBold: Platform.select({
      ios: "Pretendard-ExtraBold",
      android: "Pretendard-ExtraBold",
    }) as string,
    black: Platform.select({
      ios: "Pretendard-Black",
      android: "Pretendard-Black",
    }) as string,
  },
} as const;

export const getFontFamily = (
  family: FontFamily = "pretendard",
  weight: FontWeight = "regular"
): string => {
  if (family === "system") {
    return fontFamilies.system;
  }

  if (family in fontWeightMap) {
    const weightMap = fontWeightMap[family as keyof typeof fontWeightMap];
    if (weight in weightMap) {
      return weightMap[weight as keyof typeof weightMap];
    }
  }

  return fontFamilies[family] || fontFamilies.system;
};

export const fonts = {
  pretendard: {
    thin: getFontFamily("pretendard", "thin"), // 100
    extraLight: getFontFamily("pretendard", "extraLight"), // 200
    light: getFontFamily("pretendard", "light"), // 300
    regular: getFontFamily("pretendard", "regular"), // 400 (기본)
    medium: getFontFamily("pretendard", "medium"), // 500
    semiBold: getFontFamily("pretendard", "semiBold"), // 600
    bold: getFontFamily("pretendard", "bold"), // 700
    extraBold: getFontFamily("pretendard", "extraBold"), // 800
    black: getFontFamily("pretendard", "black"), // 900
  },
  system: fontFamilies.system,
} as const;

export const fontWeightNumbers = {
  thin: "100",
  extraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
  black: "900",
} as const;
