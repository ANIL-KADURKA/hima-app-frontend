import { Redirect } from 'expo-router';

import { APP_ROUTES } from '@/routes';
import { useAuthSession } from '@/auth/hooks/useAuthSession';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';

export default function Index() {
  const { data: session, isPending } = useAuthSession();

  if (isPending) return <LoadingIndicator />;
  const destination = session ? APP_ROUTES.client : APP_ROUTES.register;
  return <Redirect href={destination} />;
}
