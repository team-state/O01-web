import type { IGetTagListRequestParams } from 'ApiRequest';
import type { ITagListAPIResponse } from 'ApiResponse';
import {
  getParamFromRequest,
  withRequest,
  withResponse,
  prisma,
} from '@libs/server';

const getTagList = async (request: Request) => {
  const { nickName } = getParamFromRequest<IGetTagListRequestParams>(request);

  const response = await prisma.tag.findMany({
    where: {
      user: {
        nickName,
      },
    },
    select: {
      name: true,
    },
  });

  return response;
};

export const GET = async (request: Request) =>
  withResponse<ITagListAPIResponse[]>(withRequest(getTagList)(request));
