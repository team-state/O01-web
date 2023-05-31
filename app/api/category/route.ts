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
  getUserIdFromNickname,
} from '@libs/server';
import type {
  ICreateCategoryRequestParams,
  IDeleteCategoryRequestParams,
  IGetCategoryRequestParams,
  IUpdateCategoryRequestParams,
  ICategoryListAPIResponse,
} from '@types';

const IS_TEST = process.env.NODE_ENV === 'test';
const TEST_ID = process.env.TEST_USER_ID;

if (!TEST_ID) throw Error(AUTH_ERROR_MESSAGE);

const checkUserValidation = async (userId: string, categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { userId: true },
  });

  if (!category) throw new Error(PARAMETER_ERROR);

  if (category.userId !== userId) throw new Error(INVALID_USER);
};

const createCategory = async (request: Request) => {
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);

  const { name, thumbnailId, url } =
    await getBodyFromRequest<ICreateCategoryRequestParams>(request);

  if (!(name && thumbnailId && url)) throw new Error(PARAMETER_ERROR);

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

  if (!response) throw new Error(UNKNOWN_ERROR);

  return response;
};

const getCategoryList = async (request: Request) => {
  const { nickname } = getParamFromRequest<IGetCategoryRequestParams>(request);

  if (!nickname) throw new Error(PARAMETER_ERROR);

  const userId = await getUserIdFromNickname(nickname);

  const response = await prisma.category.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      thumbnailId: true,
      url: true,
      _count: {
        select: {
          post: true,
        },
      },
    },
  });

  return response;
};

const updateCategory = async (request: Request) => {
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);

  const { categoryId, name, thumbnailId, url } = await getBodyFromRequest<
    Partial<IUpdateCategoryRequestParams>
  >(request);

  if (!categoryId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, categoryId);

  const response = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(name && { name }),
      ...(thumbnailId && { thumbnailId }),
      ...(url && { url }),
    },
    select: { id: true },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

const deleteCategory = async (request: Request) => {
  const userId = IS_TEST ? TEST_ID : await getUserIdFromSession(true);
  const { id: categoryId } =
    getParamFromRequest<IDeleteCategoryRequestParams>(request);

  if (!categoryId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, Number(categoryId));

  const response = await prisma.category.delete({
    where: {
      id: Number(categoryId),
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createCategory)(request));

export const GET = async (request: Request) =>
  withResponse<ICategoryListAPIResponse[]>(
    withRequest(getCategoryList)(request),
  );

export const PATCH = async (request: Request) =>
  withResponse(withRequest(updateCategory)(request));

export const DELETE = async (request: Request) =>
  withResponse(withRequest(deleteCategory)(request));
