/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import {
  POST as createCategory,
  DELETE as deleteCategory,
} from '@api/category/route';
import {
  GET as getPost,
  POST as createPost,
  PATCH as updatePost,
  DELETE as deletePost,
} from '@api/post/route';
import type {
  ICreateCategoryRequestParams,
  ICreatePostRequestParams,
  IUpdatePostRequestParams,
} from '@types';
import {
  makeNewDataExceptSpecificKeys,
  makeRequestWithBody,
  makeRequestWithQueryParams,
} from '@utils/testingUtils';

const API_ENDPOINT_POST = 'http://localhost:3000/api/post';
const API_ENDPOINT_CATEGORY = 'http://localhost:3000/api/category';

describe('/api/post test', () => {
  let categoryId: number | undefined;
  let postId: string | undefined;

  const createPostData: ICreatePostRequestParams = {
    title: 'test Title',
    url: 'test Url',
    description: 'test Description',
    thumbnailId: 'test ThumbnailId',
    content: 'test content',
    isPrivate: false,
  };

  const updatePostData: Omit<IUpdatePostRequestParams, 'postId'> = {
    title: 'test Title Updated',
    url: 'test Url Updated',
    description: 'test Description Updated',
    thumbnailId: 'test ThumbnailId Updated',
    content: 'test content Updated',
    isPrivate: true,
    categoryId,
    tag: ['testTag1', 'testTag2'],
  };

  const filteredKeys = Object.keys(createPostData).filter(
    key => key !== 'categoryId' && key !== 'tag',
  );

  for (const key of filteredKeys) {
    test(`create : parameter [${key}] missing test`, async () => {
      const data = makeNewDataExceptSpecificKeys(createPostData, [key]);
      const request = makeRequestWithBody({
        url: API_ENDPOINT,
        data,
        method: 'POST',
      });
      const response = await createPost(request);
      expect(response.status).toBe(400);
    });
  }

  test('create post without category and tag / search', async () => {
    const data = makeNewDataExceptSpecificKeys(createPostData, [
      'categoryId',
      'tag',
    ]);

    const request = makeRequestWithBody({
      url: API_ENDPOINT_POST,
      data,
      method: 'POST',
    });

    const createResponse = await (await createPost(request)).json();
    expect(createResponse.success).toBe(true);
    expect(createResponse.data).toHaveProperty('id');

    const searchRequest = makeRequestWithQueryParams({
      url: API_ENDPOINT_POST,
      data: { id: createResponse.data.id },
      method: 'GET',
    });

    const searchResponse = await (await getPost(searchRequest)).json();
    expect(searchResponse.success).toBe(true);
    expect(searchResponse.data.category).toBe(null);
    expect(searchResponse.data.tag).toHaveLength(0);
    postId = createResponse.data.id;
  });

  test('make category for test', async () => {
    const createCategoryData: ICreateCategoryRequestParams = {
      name: 'test category name',
      thumbnailId: 'test category thumbnail',
      url: 'test category url',
    };

    const request = makeRequestWithBody({
      url: API_ENDPOINT_CATEGORY,
      data: createCategoryData,
      method: 'POST',
    });

    const response = await (await createCategory(request)).json();
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('id');
    categoryId = response.data.id;
  });

  test(`update : parameter [id] missing test`, async () => {
    const request = makeRequestWithBody({
      url: API_ENDPOINT_POST,
      data: updatePostData,
      method: 'PATCH',
    });

    const response = await updatePost(request);
    expect(response.status).toBe(400);
  });

  test(`update post / search`, async () => {
    const request = makeRequestWithBody({
      url: API_ENDPOINT_POST,
      data: { ...updatePostData, postId: postId as string },
      method: 'PATCH',
    });

    const response = await updatePost(request);
    expect(response.status).toBe(200);

    const searchRequest = makeRequestWithQueryParams({
      url: API_ENDPOINT_POST,
      data: { id: postId },
      method: 'GET',
    });

    const searchResponse = await (await getPost(searchRequest)).json();
    expect(searchResponse.success).toBe(true);

    for (const [key, value] of Object.entries(updatePostData)) {
      if (key !== 'tag') {
        expect(searchResponse.data[key]).toBe(value);
        return;
      }
      const expectedTag = updatePostData.tag;
      const updatedTag = JSON.parse(value as string).map(
        (tagObj: { tagName: string }) => tagObj.tagName,
      );
      expect(updatedTag).toEqual(expectedTag);
    }
  });

  test('delete : parameter [id] missing test', async () => {
    const deleteRequest = makeRequestWithQueryParams({
      url: API_ENDPOINT_POST,
      data: {},
      method: 'DELETE',
    });

    const deleteResponse = await deletePost(deleteRequest);
    expect(deleteResponse.status).toBe(400);
  });

  test('delete test', async () => {
    const deleteRequest = makeRequestWithQueryParams({
      url: API_ENDPOINT_POST,
      data: { id: postId as string },
      method: 'DELETE',
    });

    const deleteResponse = await (await deletePost(deleteRequest)).json();
    expect(deleteResponse.success).toBe(true);
  });

  test('delete category', async () => {
    const deleteRequest = makeRequestWithQueryParams({
      url: API_ENDPOINT_POST,
      data: { id: categoryId as number },
      method: 'DELETE',
    });

    const deleteResponse = await (await deleteCategory(deleteRequest)).json();
    expect(deleteResponse.success).toBe(true);
  });
});
