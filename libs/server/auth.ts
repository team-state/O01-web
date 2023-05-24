import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import { ENV_ERROR_MESSAGE } from '@constants/error';
import GithubProvider from './githubProviderWithScope';
import prisma from './prismaClient';

const secret = process.env.NEXT_AUTH_SECRET;
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!secret || !clientId || !clientSecret) {
  throw new Error(ENV_ERROR_MESSAGE);
}

const authOptions: NextAuthOptions = {
  secret,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
      scope: ['repo'],
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

export default authOptions;
