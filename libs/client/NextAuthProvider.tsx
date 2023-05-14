'use client';

import { SessionProvider } from 'next-auth/react';

interface NextAuthProviderProps {
  children: React.ReactElement;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
