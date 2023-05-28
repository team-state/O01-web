import { getServerSession } from 'next-auth';
import { AUTH_ERROR_MESSAGE, INVALID_USER } from '@constants/error';
import authOptions from './auth';
import prisma from './prismaClient';

type GetUserIdFromSessionReturnType<T extends boolean> = T extends true
  ? string
  : string | undefined;

const getUserIdFromSession = async <T extends boolean>(
  strict: T,
): Promise<GetUserIdFromSessionReturnType<T>> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    if (strict) throw new Error(AUTH_ERROR_MESSAGE);
    return undefined as GetUserIdFromSessionReturnType<T>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (strict && !user) throw new Error(INVALID_USER);

  return user?.id as GetUserIdFromSessionReturnType<T>;
};

export default getUserIdFromSession;
