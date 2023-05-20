import createResponse from './createResponse';

const withResponse = async <T>(
  businessLogic: (request?: Request) => Promise<T>,
): Promise<Response> => {
  try {
    return createResponse<T>(await businessLogic(), 200);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return createResponse(errorMessage, 500, true);
  }
};

export default withResponse;
