import withResponse from '@libs/server/withResponse';

interface IImageAPIResponse {
  id: string;
  url: string;
}

const getImageUploadURL = async (): Promise<IImageAPIResponse> => {
  const {
    result: { id, uploadURL },
  } = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_API_TOKEN}`,
      },
      method: 'POST',
      cache: 'no-store',
    },
  ).then(res => res.json());

  return {
    id,
    url: uploadURL,
  };
};

export const GET = async () => {
  return withResponse(getImageUploadURL);
};
