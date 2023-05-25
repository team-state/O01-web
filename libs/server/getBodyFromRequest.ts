const getBodyFromRequest = async <T>(request: Request): Promise<T> => {
  const body = await request.json();
  return body as T;
};

export default getBodyFromRequest;
