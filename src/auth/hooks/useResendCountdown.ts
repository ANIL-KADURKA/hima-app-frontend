import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { RESEND_DELAY_SECONDS } from '../constants/auth';

export function useResendCountdown() {
  const [deadline, setDeadline] = useState(() => Date.now() + RESEND_DELAY_SECONDS * 1000);
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_DELAY_SECONDS);

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) clearInterval(interval);
    };
    const interval = setInterval(update, 1000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') update();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [deadline]);

  function restart() {
    setSecondsRemaining(RESEND_DELAY_SECONDS);
    setDeadline(Date.now() + RESEND_DELAY_SECONDS * 1000);
  }

  return { secondsRemaining, restart };
}
