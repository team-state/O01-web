import { INVALID_USER, PARAMETER_ERROR, UNKNOWN_ERROR } from '@constants/error';
import {
  prisma,
  withRequest,
  withResponse,
  getParamFromRequest,
  getUserIdFromSession,
  getUserIdFromEmail,
} from '@libs/server';

interface ICategoryListAPIResponse {
  id: number;
  name: string;
  url: string;
  thumbnailId: string;
}

const createCategory = async (request: Request) => {
  const userId = await getUserIdFromSession();
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

const getCategory = async (request: Request) => {
  const email = getParamFromRequest(request, 'email');

  if (!email) throw Error(PARAMETER_ERROR);

  const userId = await getUserIdFromEmail(email);

  const response = await prisma.category.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      thumbnailId: true,
      url: true,
    },
  });

  return response;
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createCategory)(request));

export const GET = async (request: Request) =>
  withResponse<ICategoryListAPIResponse[]>(withRequest(getCategory)(request));
