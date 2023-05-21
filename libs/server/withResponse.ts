import {
  AUTH_ERROR_MESSAGE,
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
    console.error(e);

    const errorMessage = e instanceof Error ? e.message : UNKNOWN_ERROR;

    switch (errorMessage) {
      case AUTH_ERROR_MESSAGE:
        return createResponse(errorMessage, 401, true);
      case PARAMETER_ERROR:
        return createResponse(errorMessage, 400, true);
      default:
        return createResponse(UNKNOWN_ERROR, 500, true);
    }
  }
};

export default withResponse;
