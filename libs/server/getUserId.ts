import { getServerSession } from 'next-auth';
import authOptions from './auth';
import prisma from './prismaClient';

const getUserId = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return user?.id;
};

export default getUserId;
