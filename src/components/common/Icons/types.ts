export interface IconStyleProps {
  size?: number;
  color?: string;
}

export type IconName = 'car' | 'home' | 'report' | 'user';

export interface IconProps extends IconStyleProps {
  name: IconName;
}
