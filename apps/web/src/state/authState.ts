import {type QueryClient, useQuery} from '@tanstack/react-query';
import {z} from 'zod';

import {setAuthToken} from '../api/client';

const AUTH_STORAGE_KEY = 'rimdp_token';
export const AUTH_SESSION_UPDATED_EVENT = 'rimdp-auth-session-updated';

const authSessionSchema = z.object({token: z.string().min(1)});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const authSessionQueryKey = ['auth', 'session'] as const;

const readStoredAuthSession = (): AuthSession|null => {
  const rawToken = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawToken) {
    return null;
  }

  const parsedSession = authSessionSchema.safeParse({token: rawToken});
  if (!parsedSession.success) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  return parsedSession.data;
};

export const initializeAuthSession = (queryClient: QueryClient) => {
  const session = readStoredAuthSession();
  setAuthToken(session?.token ?? null);
  queryClient.setQueryData(authSessionQueryKey, session);
};

export const setAuthSession = (queryClient: QueryClient, token: string) => {
  const parsedSession = authSessionSchema.parse({token});
  localStorage.setItem(AUTH_STORAGE_KEY, parsedSession.token);
  setAuthToken(parsedSession.token);
  queryClient.setQueryData(authSessionQueryKey, parsedSession);
  window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));
};

export const clearAuthSession = (queryClient: QueryClient) => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  setAuthToken(null);
  queryClient.setQueryData(authSessionQueryKey, null);
  window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));
};

export const syncAuthSessionFromStorage = (queryClient: QueryClient) => {
  const session = readStoredAuthSession();
  setAuthToken(session?.token ?? null);
  queryClient.setQueryData(authSessionQueryKey, session);
};

export const useAuthSession = () => useQuery({
  queryKey: authSessionQueryKey,
  queryFn: async () => readStoredAuthSession(),
  enabled: false,
  initialData: readStoredAuthSession,
  staleTime: Infinity,
  gcTime: Infinity
});