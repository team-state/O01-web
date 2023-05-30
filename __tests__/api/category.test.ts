/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import {
  GET as getCategoryList,
  POST as createCategory,
  PATCH as updateCategory,
  DELETE as deleteCategory,
} from '@api/category/route';
import { UNKNOWN_ERROR } from '@constants/error';
import { prisma } from '@libs/server';
import { ICreateCategoryRequestParams } from '@types';
import {
  makeNewDataExceptSpecificKeys,
  makeRequestWithBody,
  makeRequestWithQueryParams,
} from '@utils/testingUtils';

const API_ENDPOINT = 'http://localhost:3000/api/category';

describe('/api/category test', () => {
  let categoryId: number | undefined;

  const createCategoryData: ICreateCategoryRequestParams = {
    name: 'test category',
    thumbnailId: 'test thumbnailId',
    url: 'test url',
  };

  const updateCategoryData: ICreateCategoryRequestParams = {
    name: 'test category updated',
    thumbnailId: 'test thumbnailId updated',
    url: 'test url updated',
  };

  Object.keys(createCategoryData).forEach(key => {
    test(`create : parameter [${key}] missing test`, async () => {
      const data = makeNewDataExceptSpecificKeys(createCategoryData, [key]);
      const request = makeRequestWithBody({
        url: API_ENDPOINT,
        data,
        method: 'POST',
      });
      const response = await createCategory(request);
      expect(response.status).toBe(400);
    });
  });

  test('create category', async () => {
    const request = makeRequestWithBody({
      url: API_ENDPOINT,
      data: createCategoryData,
      method: 'POST',
    });

    const createResponse = await (await createCategory(request)).json();
    expect(createResponse.success).toBe(true);
    expect(createResponse.data).toHaveProperty('id');
    categoryId = createResponse.data.id;
  });

  test('search : parameter [nickname] missing test', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: {},
      method: 'GET',
    });

    const response = await getCategoryList(request);
    expect(response.status).toBe(400);
  });

  test('search category list', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: {
        nickname: process.env.TEST_USER_NICKNAME,
      },
      method: 'GET',
    });

    const response = await (await getCategoryList(request)).json();

    expect(response.data).not.toHaveLength(0);
  });

  test(`update : parameter [id] missing test`, async () => {
    const request = makeRequestWithBody({
      url: API_ENDPOINT,
      data: updateCategoryData,
      method: 'PATCH',
    });

    const response = await updateCategory(request);
    expect(response.status).toBe(400);
  });

  test(`update category`, async () => {
    const request = makeRequestWithBody({
      url: API_ENDPOINT,
      data: { ...updateCategoryData, categoryId: categoryId as number },
      method: 'PATCH',
    });

    const response = await updateCategory(request);
    expect(response.status).toBe(200);

    try {
      const updatedCategory = (await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          name: true,
          url: true,
          thumbnailId: true,
        },
      })) as { [key: string]: string } | null;

      if (!updatedCategory) throw new Error(UNKNOWN_ERROR);

      for (const [key, value] of Object.entries(updateCategoryData)) {
        expect(updatedCategory[key]).toBe(value);
      }
    } catch (e) {
      console.error(e);
    }
  });

  test('delete : parameter [id] missing test', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: {},
      method: 'DELETE',
    });

    const deleteResponse = await deleteCategory(request);
    expect(deleteResponse.status).toBe(400);
  });

  test('delete category', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: { id: categoryId as number },
      method: 'DELETE',
    });

    const deleteResponse = await (await deleteCategory(request)).json();
    expect(deleteResponse.success).toBe(true);
  });
});
