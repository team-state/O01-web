import { INVALID_USER, PARAMETER_ERROR } from '@constants/error';
import prisma from './prismaClient';

const getUserIdFromEmail = async (email: string) => {
  if (!email) throw Error(PARAMETER_ERROR);

  const response = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!response) throw Error(INVALID_USER);

  return response.id;
};

export default getUserIdFromEmail;
