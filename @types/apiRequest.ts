import { Category, Post, User } from '@prisma/client';

export type ICreatePostRequestParams = Omit<
  Post,
  'createdAt' | 'updateAt' | 'id' | 'userId' | 'categoryId'
> & {
  categoryId?: number;
  tag?: string[];
};

export type IGetPostRequestParams = Pick<Post, 'id'>;

export type IGetPostListRequestParams = Partial<
  Pick<User, 'nickname'> &
    Pick<Post, 'title' | 'categoryId'> & { date?: string; tagName: string }
>;

export type IUpdatePostRequestParams = ICreatePostRequestParams & {
  postId: number;
};

export type IDeletePostRequestParams = IGetPostRequestParams;

export type ICreateCategoryRequestParams = Pick<
  Category,
  'name' | 'thumbnailId' | 'url'
>;

export type IGetCategoryRequestParams = Pick<User, 'nickname'> &
  Partial<Pick<Category, 'url' | 'name'>>;

export type IUpdateCategoryRequestParams = ICreateCategoryRequestParams & {
  categoryId: number;
};

export type IDeleteCategoryRequestParams = IDeletePostRequestParams;

export type IGetTagListRequestParams = Pick<User, 'nickname'>;
