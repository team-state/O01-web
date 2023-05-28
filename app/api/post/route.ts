import {
  AUTH_ERROR_MESSAGE,
  INVALID_USER,
  PARAMETER_ERROR,
  UNKNOWN_ERROR,
} from '@constants/error';
import {
  prisma,
  withRequest,
  withResponse,
  getBodyFromRequest,
  getParamFromRequest,
  getUserIdFromSession,
} from '@libs/server';
import type {
  ICreatePostRequestParams,
  IDeletePostRequestParams,
  IGetPostRequestParams,
  IUpdatePostRequestParams,
  IPostDetailAPIResponse,
} from '@types';

const IS_TEST = process.env.NODE_ENV === 'test';
const TEST_ID = process.env.TEST_USER_ID;

if (!TEST_ID) throw Error(AUTH_ERROR_MESSAGE);

const checkUserValidation = async (userId: string, postId: number) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

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
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);

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
      isPrivate !== undefined &&
      typeof isPrivate === 'boolean'
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
            id: categoryId,
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

  return response;
};

const getPost = async (request: Request) => {
  const { id: postId } = getParamFromRequest<IGetPostRequestParams>(request);

  if (!postId) throw new Error(PARAMETER_ERROR);

  const response = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    select: {
      id: true,
      title: true,
      content: true,
      description: true,
      thumbnailId: true,
      url: true,
      category: {
        select: {
          name: true,
        },
      },
      isPrivate: true,
      tag: {
        select: {
          tagName: true,
        },
      },
      user: { select: { id: true, name: true, image: true } },
    },
  });

  if (response && response.isPrivate) {
    const userIdFromSession = IS_TEST
      ? TEST_ID
      : await getUserIdFromSession(true);
    if (response.user.id !== userIdFromSession) throw new Error(INVALID_USER);
  }

  return response;
};

const updatePost = async (request: Request) => {
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);

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
    where: { id: postId },
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
            id: categoryId,
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
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);
  const { id: postId } = getParamFromRequest<IDeletePostRequestParams>(request);

  if (!postId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, Number(postId));

  const response = await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createPost)(request));

export const GET = async (request: Request) =>
  withResponse<IPostDetailAPIResponse>(withRequest(getPost)(request));

export const PATCH = async (request: Request) =>
  withResponse(withRequest(updatePost)(request));

export const DELETE = async (request: Request) =>
  withResponse(withRequest(deletePost)(request));
