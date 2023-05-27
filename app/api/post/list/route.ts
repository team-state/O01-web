import type { IGetPostListRequestParams } from 'ApiRequest';
import type { IPostListAPIResponse } from 'ApiResponse';
import { PARAMETER_ERROR } from '@constants/error';
import {
  getParamFromRequest,
  withRequest,
  withResponse,
  prisma,
  getUserIdFromEmail,
  getUserIdFromSession,
} from '@libs/server';

export const dynamic = 'force-dynamic';

const paramValidation = ({
  categoryId,
  tagName,
  title,
  email,
  date,
}: IGetPostListRequestParams) => {
  const paramCount = [categoryId, tagName, title].filter(
    param => param !== undefined,
  ).length;

  if (paramCount >= 2 || (email && date) || (!email && !date))
    throw new Error(PARAMETER_ERROR);
};

const getPostList = async (request: Request) => {
  const { email, date, title, tagName, categoryId } =
    getParamFromRequest<IGetPostListRequestParams>(request);

  paramValidation({ categoryId, tagName, title, email, date });

  const userIdFromSession = await getUserIdFromSession(false);
  const userIdFromEmail = email && (await getUserIdFromEmail(email));

  const response = await prisma.post.findMany({
    where: {
      ...(!((userIdFromSession === userIdFromEmail) !== undefined) && {
        isPrivate: false,
      }),
      ...(userIdFromEmail && { user: { id: userIdFromEmail } }),
      ...(date && { createdAt: date }),
      ...(title && {
        title: {
          contains: title,
        },
      }),
      ...(categoryId && { category: { id: +categoryId } }),
      ...(tagName && {
        tag: {
          some: {
            tagName,
          },
        },
      }),
    },
    include: {
      tag: {
        select: {
          tagName: true,
        },
      },
    },
  });

  return response;
};

export const GET = async (request: Request) =>
  withResponse<IPostListAPIResponse[]>(withRequest(getPostList)(request));
