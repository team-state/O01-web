declare module 'ApiRequest' {
  interface ICreatePostRequestParams {
    url: string;
    title: string;
    description: string;
    thumbnailId: string;
    content: string;
    isPrivate: boolean;
    categoryId?: string;
    tag?: string[];
  }

  interface IGetPostRequestParams {
    id: string;
  }

  interface IGetPostListRequestParams {
    email?: string;
    date?: string;
    title?: string;
    tagName?: string;
    categoryId?: string;
  }

  interface IUpdatePostRequestParams extends ICreatePostRequestParams {
    postId: string;
  }

  interface IDeletePostRequestParams extends IGetPostRequestParams {}

  interface ICreateCategoryRequestParams {
    name: string;
    thumbnailId: string;
    url: string;
  }

  interface IGetCategoryRequestParams {
    email: string;
    url?: string;
    name?: string;
  }

  interface IUpdateCategoryRequestParams extends ICreateCategoryRequestParams {
    categoryId: string;
  }

  interface IDeleteCategoryRequestParams extends IDeletePostRequestParams {}
}
