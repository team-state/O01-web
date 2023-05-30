import { GET as getTagList } from '@api/tag/route';
import { makeRequestWithQueryParams } from '@utils/testingUtils';

const API_ENDPOINT = 'http://localhost:3000/api/tag';

describe('/api/tag test', () => {
  test('search : parameter [nickname] missing test', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: {},
      method: 'GET',
    });

    const response = await getTagList(request);
    expect(response.status).toBe(400);
  });

  test('search tag list', async () => {
    const request = makeRequestWithQueryParams({
      url: API_ENDPOINT,
      data: {
        nickname: process.env.TEST_USER_NICKNAME,
      },
      method: 'GET',
    });

    const response = await (await getTagList(request)).json();

    expect(response.data).not.toHaveLength(0);
  });
});
