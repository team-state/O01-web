interface MakeRequestProps {
  url: string;
  data: { [key: string]: any };
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}

export const makeRequestWithBody = ({
  url,
  data,
  method,
}: MakeRequestProps) => {
  const requestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return new Request(url, requestInit);
};

export const makeRequestWithQueryParams = ({
  url,
  data,
  method,
}: MakeRequestProps) => {
  const urlWithParams = new URL(url);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    urlWithParams.searchParams.append(key, value);
  }

  const requestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Request(urlWithParams.toString(), requestInit);
};

export const makeNewDataExceptSpecificKeys = (
  obj: { [key: string]: any },
  keysToRemove: string[],
) => {
  return Object.keys(obj)
    .filter(key => !keysToRemove.includes(key))
    .reduce((newObj: { [key: string]: any }, key) => {
      // eslint-disable-next-line no-param-reassign
      newObj[key] = obj[key];
      return newObj;
    }, {});
};
