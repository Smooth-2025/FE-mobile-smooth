import { AutoCamera } from '@/components/camera/AutoCamera';
import { useCameraPermissionHandler } from '@/hooks/useCameraPermission';
import MainTabs from '@/navigations/MainTabs';
import { useEffect } from 'react';

export default function MainLayout() {
  const { hasPermission, requestCameraPermission } = useCameraPermissionHandler();

  useEffect(() => {
    if (!hasPermission) {
      requestCameraPermission();
    }
  }, [hasPermission]);

  return (
    <>
      {hasPermission && <AutoCamera />}
      <MainTabs />
    </>
  );
}
