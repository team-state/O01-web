const getParamFromRequest = (request: Request, key: string) =>
  new URL(request.url).searchParams.get(key);

export default getParamFromRequest;
