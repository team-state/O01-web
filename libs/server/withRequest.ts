const withRequest =
  <T>(businessLogic: (request: Request) => Promise<T>) =>
  (request: Request) => {
    return () => businessLogic(request);
  };

export default withRequest;
