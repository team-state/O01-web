import { PARAMETER_ERROR } from '@constants/error';
import {
  getParamFromRequest,
  withRequest,
  withResponse,
  prisma,
  getUserIdFromNickname,
  getUserIdFromSession,
} from '@libs/server';
import type { IGetPostListRequestParams, IPostListAPIResponse } from '@types';

export const dynamic = 'force-dynamic';

const paramValidation = ({
  categoryId,
  tagName,
  title,
  nickname,
  date,
}: IGetPostListRequestParams) => {
  const paramCount = [categoryId, tagName, title].filter(
    param => param !== undefined,
  ).length;

  if (paramCount >= 2 || (nickname && date) || (!nickname && !date))
    throw new Error(PARAMETER_ERROR);
};

const getPostList = async (request: Request) => {
  const { nickname, date, title, tagName, categoryId } =
    getParamFromRequest<IGetPostListRequestParams>(request);

  paramValidation({ categoryId, tagName, title, nickname, date });

  const userIdFromSession = await getUserIdFromSession(false);
  const userIdFromNickname =
    nickname && (await getUserIdFromNickname(nickname));

  const response = await prisma.post.findMany({
    where: {
      ...(!(userIdFromSession && userIdFromNickname === userIdFromSession) && {
        isPrivate: false,
      }),
      ...(userIdFromNickname && { user: { nickname: userIdFromNickname } }),
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
