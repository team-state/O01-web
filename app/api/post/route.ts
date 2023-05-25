import type {
  ICreatePostRequestParams,
  IDeletePostRequestParams,
  IGetPostRequestParams,
  IUpdatePostRequestParams,
} from 'ApiRequest';
import type { IPostDetailAPIResponse } from 'ApiResponse';
import { INVALID_USER, PARAMETER_ERROR, UNKNOWN_ERROR } from '@constants/error';
import {
  prisma,
  withRequest,
  withResponse,
  getBodyFromRequest,
  getParamFromRequest,
  getUserIdFromSession,
} from '@libs/server';

const checkUserValidation = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({ where: { id: +postId } });

  if (!post) throw new Error(PARAMETER_ERROR);

  if (post.userId !== userId) throw new Error(INVALID_USER);
};

const deleteTagFromPost = async (postId: number) => {
  const response = await prisma.post_Tag.deleteMany({
    where: {
      postId,
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

const createPost = async (request: Request) => {
  const userId = await getUserIdFromSession();
  const {
    url,
    title,
    description,
    thumbnailId,
    content,
    isPrivate,
    categoryId,
    tag,
  } = await getBodyFromRequest<ICreatePostRequestParams>(request);

  if (
    !(
      url &&
      title &&
      description &&
      thumbnailId &&
      content &&
      String(isPrivate)
    )
  )
    throw new Error(PARAMETER_ERROR);

  const response = await prisma.post.create({
    data: {
      url,
      title,
      description,
      thumbnailId,
      content,
      isPrivate,
      ...(categoryId && {
        category: {
          connect: {
            id: +categoryId,
          },
        },
      }),
      user: {
        connect: {
          id: userId,
        },
      },
      ...(tag &&
        tag?.length > 0 && {
          tag: {
            create: tag.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName, userId },
                },
              },
            })),
          },
        }),
    },
    select: {
      id: true,
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

const getPost = async (request: Request) => {
  const { id: postId } = getParamFromRequest<IGetPostRequestParams>(request);

  if (!postId) throw new Error(PARAMETER_ERROR);

  const response = await prisma.post.findUnique({
    where: {
      id: +postId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      category: {
        select: {
          name: true,
        },
      },
      tag: {
        select: {
          tagName: true,
        },
      },
    },
  });

  return response;
};

const updatePost = async (request: Request) => {
  const userId = await getUserIdFromSession();

  const {
    postId,
    url,
    title,
    description,
    thumbnailId,
    content,
    isPrivate,
    categoryId,
    tag,
  } = await getBodyFromRequest<Partial<IUpdatePostRequestParams>>(request);

  if (!postId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, postId);

  if (tag || tag === null) await deleteTagFromPost(+postId);

  const response = await prisma.post.update({
    where: { id: +postId },
    data: {
      ...(url && { url }),
      ...(title && { title }),
      ...(description && { description }),
      ...(thumbnailId && { thumbnailId }),
      ...(content && { content }),
      ...(isPrivate && { isPrivate }),
      ...(categoryId === null && {
        category: {
          disconnect: true,
        },
      }),
      ...(categoryId && {
        category: {
          connect: {
            id: +categoryId,
          },
        },
      }),
      ...(tag &&
        tag?.length > 0 && {
          tag: {
            create: tag.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName, userId },
                },
              },
            })),
          },
        }),
    },
    select: {
      id: true,
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

const deletePost = async (request: Request) => {
  const userId = await getUserIdFromSession();
  const { id: postId } = getParamFromRequest<IDeletePostRequestParams>(request);

  if (!postId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, postId);

  const response = await prisma.post.delete({
    where: {
      id: +postId,
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createPost)(request));

export const GET = async (request: Request) =>
  withResponse<IPostDetailAPIResponse | null>(withRequest(getPost)(request));

export const PATCH = async (request: Request) =>
  withResponse(withRequest(updatePost)(request));

export const DELETE = async (request: Request) =>
  withResponse(withRequest(deletePost)(request));
