import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { useTheme } from "@emotion/react";
import { Theme } from "@styles/theme";

interface TextProps extends RNTextProps {
  fontFamily?: "system" | "pretendard";
  fontWeight?:
    | "thin"
    | "extraLight"
    | "light"
    | "regular"
    | "medium"
    | "semiBold"
    | "bold"
    | "extraBold"
    | "black";
  fontSize?: number;
}

export const Text: React.FC<TextProps> = ({
  fontFamily = "pretendard",
  fontWeight = "regular",
  fontSize = 16,
  style,
  ...props
}) => {
  const theme = useTheme() as Theme;

  const getFontStyle = () => {
    const baseStyle = {
      fontSize: fontSize,
    };

    if (fontFamily === "system") {
      return {
        ...baseStyle,
        fontFamily: theme.typography.fonts.system,
        fontWeight: theme.typography.fontWeights[fontWeight] as any,
      };
    }

    const fontName = theme.typography.fonts.pretendard[fontWeight];

    return {
      ...baseStyle,
      fontFamily: fontName,
    };
  };

  return <RNText style={[getFontStyle(), style]} {...props} />;
};
