import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;

    NetInfo.fetch().then(state => {
      if (!cancelled) setIsOnline(state.isConnected !== false);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected !== false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return isOnline;
}