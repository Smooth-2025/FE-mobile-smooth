import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from '@/constants/icon.constants';
import Svg, { Path } from 'react-native-svg';
import { IconStyleProps } from './type';

export function UserIcon({ size = DEFAULT_ICON_SIZE, color = DEFAULT_ICON_COLOR }: IconStyleProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}
