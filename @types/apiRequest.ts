export interface ICreatePostRequestParams {
  url: string;
  title: string;
  description: string;
  thumbnailId: string;
  content: string;
  isPrivate: boolean;
  categoryId?: string;
  tag?: string[];
}

export interface IGetPostRequestParams {
  id: string;
}

export interface IGetPostListRequestParams {
  nickname?: string;
  date?: string;
  title?: string;
  tagName?: string;
  categoryId?: string;
}

export interface IUpdatePostRequestParams extends ICreatePostRequestParams {
  postId: string;
}

export interface IDeletePostRequestParams extends IGetPostRequestParams {}

export interface ICreateCategoryRequestParams {
  name: string;
  thumbnailId: string;
  url: string;
}

export interface IGetCategoryRequestParams {
  nickname: string;
  url?: string;
  name?: string;
}

export interface IUpdateCategoryRequestParams
  extends ICreateCategoryRequestParams {
  categoryId: string;
}

export interface IDeleteCategoryRequestParams
  extends IDeletePostRequestParams {}

export interface IGetTagListRequestParams {
  nickname: string;
}
