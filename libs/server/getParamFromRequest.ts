import { PARAMETER_ERROR } from '@constants/error';

const getParamFromRequest = <T>(request: Request): T => {
  const { searchParams } = new URL(request.url);

  if (!searchParams) throw new Error(PARAMETER_ERROR);

  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params as T;
};
export default getParamFromRequest;
