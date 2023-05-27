import { PARAMETER_ERROR } from '@constants/error';
import {
  getParamFromRequest,
  withRequest,
  withResponse,
  prisma,
} from '@libs/server';
import type { IGetTagListRequestParams, ITagListAPIResponse } from '@types';

export const dynamic = 'force-dynamic';

const getTagList = async (request: Request) => {
  const { nickName } = getParamFromRequest<IGetTagListRequestParams>(request);

  if (!nickName) throw Error(PARAMETER_ERROR);

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
