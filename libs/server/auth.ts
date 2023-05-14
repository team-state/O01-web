import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { ENV_ERROR_MESSAGE } from '@constants/error';
import prisma from '@libs/server/prismaClient';

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
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

export default authOptions;