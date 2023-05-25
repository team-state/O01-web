import { getServerSession } from 'next-auth';
import { AUTH_ERROR_MESSAGE, INVALID_USER } from '@constants/error';
import authOptions from './auth';
import prisma from './prismaClient';

const getUserIdFromSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error(AUTH_ERROR_MESSAGE);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw new Error(INVALID_USER);

  const { id } = user;

  return id;
};

export default getUserIdFromSession;
