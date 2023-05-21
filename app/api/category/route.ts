import { PARAMETER_ERROR, UNKNOWN_ERROR } from '@constants/error';
import { prisma, withRequest, withResponse } from '@libs/server';
import getUserId from 'libs/server/getUserId';

const createCategory = async (request: Request) => {
  const userId = await getUserId();
  const body = await request.json();

  const { name, thumbnailId, url } = body;

  if (!(name && thumbnailId && url)) throw Error(PARAMETER_ERROR);

  const response = await prisma.category.create({
    data: {
      name,
      thumbnailId,
      url,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!response) throw Error(UNKNOWN_ERROR);
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createCategory)(request));
