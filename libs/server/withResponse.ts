import {
  AUTH_ERROR_MESSAGE,
  INVALID_USER,
  PARAMETER_ERROR,
  UNKNOWN_ERROR,
} from '@constants/error';
import createResponse from './createResponse';

const withResponse = async <T>(
  businessLogic: () => Promise<T>,
): Promise<Response> => {
  try {
    return createResponse<T>(await businessLogic(), 200);
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') console.error(e);

    const errorMessage = e instanceof Error ? e.message : UNKNOWN_ERROR;

    switch (errorMessage) {
      case AUTH_ERROR_MESSAGE:
      case INVALID_USER:
        return createResponse(errorMessage, 401, true);
      case PARAMETER_ERROR:
        return createResponse(errorMessage, 400, true);
      case UNKNOWN_ERROR:
        return createResponse(errorMessage, 500, true);
      default:
        return createResponse(errorMessage, 500, true);
    }
  }
};

export default withResponse;
