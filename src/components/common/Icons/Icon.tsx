import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from '@/constants/icon.constants';
import { CarIcon } from './CarIcon';
import { HomeIcon } from './HomeIcon';
import { ReportIcon } from './ReportIcon';
import { UserIcon } from './UserIcon';
import { IconProps } from './types';

export function Icon({ name, size = DEFAULT_ICON_SIZE, color = DEFAULT_ICON_COLOR }: IconProps) {
  switch (name) {
    case 'home':
      return <HomeIcon size={size} color={color} />;
    case 'car':
      return <CarIcon size={size} color={color} />;
    case 'report':
      return <ReportIcon size={size} color={color} />;
    case 'user':
      return <UserIcon size={size} color={color} />;
    default:
      return null;
  }
}
