import type {
  ICreateCategoryRequestParams,
  IDeleteCategoryRequestParams,
  IGetCategoryRequestParams,
  IUpdateCategoryRequestParams,
} from 'ApiRequest';
import type { ICategoryListAPIResponse } from 'ApiResponse';
import { INVALID_USER, PARAMETER_ERROR, UNKNOWN_ERROR } from '@constants/error';
import {
  prisma,
  withRequest,
  withResponse,
  getBodyFromRequest,
  getParamFromRequest,
  getUserIdFromSession,
  getUserIdFromEmail,
} from '@libs/server';

const checkUserValidation = async (userId: string, categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: +categoryId },
    select: { userId: true },
  });

  if (!category) throw new Error(PARAMETER_ERROR);

  if (category.userId !== userId) throw new Error(INVALID_USER);
};

const createCategory = async (request: Request) => {
  const userId = await getUserIdFromSession();

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
};

const getCategory = async (request: Request) => {
  const { email, url, name } =
    getParamFromRequest<IGetCategoryRequestParams>(request);

  if (!email) throw new Error(PARAMETER_ERROR);
  if (url && name) throw new Error(PARAMETER_ERROR);

  const userId = await getUserIdFromEmail(email);

  const response = await prisma.category.findMany({
    where: {
      userId,
      ...(url && { url }),
      ...(name && { name }),
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

const updateCategory = async (request: Request) => {
  const userId = await getUserIdFromSession();

  const { categoryId, name, thumbnailId, url } = await getBodyFromRequest<
    Partial<IUpdateCategoryRequestParams>
  >(request);

  if (!categoryId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, categoryId);

  const response = await prisma.category.update({
    where: { id: +categoryId },
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
  const userId = await getUserIdFromSession();
  const { id: categoryId } =
    getParamFromRequest<IDeleteCategoryRequestParams>(request);

  if (!categoryId) throw new Error(PARAMETER_ERROR);

  await checkUserValidation(userId, categoryId);

  const response = await prisma.category.delete({
    where: {
      id: +categoryId,
    },
  });

  if (!response) throw new Error(UNKNOWN_ERROR);
};

export const POST = async (request: Request) =>
  withResponse(withRequest(createCategory)(request));

export const GET = async (request: Request) =>
  withResponse<ICategoryListAPIResponse[]>(withRequest(getCategory)(request));

export const PATCH = async (request: Request) =>
  withResponse(withRequest(updateCategory)(request));

export const DELETE = async (request: Request) =>
  withResponse(withRequest(deleteCategory)(request));
