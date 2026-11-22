import { useQuery } from '@tanstack/react-query';

import { restoreAuthSession } from '@/auth/api/authApi';
import { AUTH_QUERY_KEYS } from '@/auth/constants/query';
import type { AuthSession } from '@/auth/types/session';

export function useAuthSession() {
  return useQuery<AuthSession | null, Error>({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: restoreAuthSession,
    retry: false,
    staleTime: Infinity,
  });
}
