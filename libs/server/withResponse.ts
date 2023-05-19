const createResponse = <T>(
  data: T,
  status: number,
  isError: boolean = false,
) => {
  return new Response(JSON.stringify({ success: !isError, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const withResponse = async <T>(
  request: Request,
  businessLogic: (req: Request) => Promise<T>,
): Promise<Response> => {
  try {
    return createResponse<T>(await businessLogic(request), 200);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return createResponse(errorMessage, 500, true);
  }
};

export default withResponse;
