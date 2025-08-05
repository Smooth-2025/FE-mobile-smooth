import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from '@/constants/icon.constants';
import { CarIcon } from './CarIcon';
import CheckmarkCircleIcon from './CheckmarkCircleIcon';
import { HomeIcon } from './HomeIcon';
import { ReportIcon } from './ReportIcon';
import { IconProps } from './type';
import { UserIcon } from './UserIcon';
import WarningCircleIcon from './WarningCircleIcon';
import WarningTriangleIcon from './WarningTriangleIcon';

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
    case 'checkmarkCircle':
      return <CheckmarkCircleIcon size={size} color={color} />;
    case 'warningCircle':
      return <WarningCircleIcon size={size} color={color} />;
    case 'warningTriangle':
      return <WarningTriangleIcon size={size} color={color} />;
    default:
      return null;
  }
}
