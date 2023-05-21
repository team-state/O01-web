import {
  AUTH_ERROR_MESSAGE,
  PARAMETER_ERROR,
  UNKNOWN_ERROR,
} from '@constants/error';
import { prisma, withRequest, withResponse } from '@libs/server';
import getUserId from 'libs/server/getUserId';

const createPost = async (request: Request) => {
  const body = await request.json();

  const userId = await getUserId();

  const {
    url,
    title,
    description,
    thumbnailId,
    content,
    isPrivate,
    categoryId,
    tags,
  } = body;

  if (!userId) {
    throw Error(AUTH_ERROR_MESSAGE);
  }

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
      ...(tags && {
        tag: {
          create: tags.map((tagName: string) => ({
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
    ...(tags && {
      include: {
        tag: true,
      },
    }),
  });

  if (!response) {
    throw Error(UNKNOWN_ERROR);
  }
};

export const POST = async (req: Request) => {
  return withResponse(withRequest(createPost)(req));
};
