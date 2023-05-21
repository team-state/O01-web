import { PARAMETER_ERROR, UNKNOWN_ERROR } from '@constants/error';
import { prisma, withRequest, withResponse } from '@libs/server';
import getUserId from 'libs/server/getUserId';

const deleteTagFormPost = async (postId: number) => {
  const response = await prisma.post_Tag.deleteMany({
    where: {
      postId,
    },
  });

  if (!response) {
    throw Error(UNKNOWN_ERROR);
  }
};

const createPost = async (request: Request) => {
  const userId = await getUserId();
  const body = await request.json();

  const {
    url,
    title,
    description,
    thumbnailId,
    content,
    isPrivate,
    categoryId,
    tag,
  } = body;

  if (
    !(
      url &&
      title &&
      description &&
      thumbnailId &&
      content &&
      String(isPrivate)
    )
  ) {
    throw Error(PARAMETER_ERROR);
  }

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
      ...(tag?.length > 0 && {
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

  if (!response) {
    throw Error(UNKNOWN_ERROR);
  }
};

const updatePost = async (request: Request) => {
  const userId = await getUserId();
  const body = await request.json();

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
  } = body;

  if (!postId) throw Error(PARAMETER_ERROR);

  if (tag || tag === null) await deleteTagFormPost(postId);

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
      ...(tag?.length > 0 && {
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

  if (!response) {
    throw Error(UNKNOWN_ERROR);
  }
};

export const POST = async (request: Request) => {
  return withResponse(withRequest(createPost)(request));
};

export const PUT = async (request: Request) => {
  return withResponse(withRequest(updatePost)(request));
};
