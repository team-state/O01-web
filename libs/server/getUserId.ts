import { getServerSession } from 'next-auth';
import { AUTH_ERROR_MESSAGE, INVALID_USER } from '@constants/error';
import authOptions from './auth';
import prisma from './prismaClient';

const getUserId = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw Error(AUTH_ERROR_MESSAGE);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) throw Error(INVALID_USER);

  const { id } = user;

  return id;
};

export default getUserId;
