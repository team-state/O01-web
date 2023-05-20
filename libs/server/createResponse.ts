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

export default createResponse;
