// src/types/emotion.d.ts
import "@emotion/react";
import { Theme } from "../styles/theme";

declare module "@emotion/react" {
  export interface Theme extends Theme {}
}
