import { INVALID_USER, PARAMETER_ERROR } from '@constants/error';
import prisma from './prismaClient';

const getUserIdFromNickname = async (nickname: string) => {
  if (!nickname) throw new Error(PARAMETER_ERROR);

  const response = await prisma.user.findUnique({
    where: {
      nickname,
    },
  });

  if (!response) throw new Error(INVALID_USER);

  return response.id;
};

export default getUserIdFromNickname;
