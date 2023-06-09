import { Category, Post, User } from '@prisma/client';

export type ICreatePostRequestParams = Omit<
  Post,
  'createdAt' | 'updatedAt' | 'id' | 'userId' | 'categoryId'
> & {
  categoryId?: number;
  tag?: string[];
};

export type IGetPostRequestParams = Partial<
  Pick<Post, 'url' | 'id'> & Pick<User, 'nickname'>
>;

export type IGetPostListRequestParams = Partial<
  Pick<User, 'nickname'> &
    Pick<Post, 'title' | 'categoryId'> & { date?: string; tagName: string }
>;

export type IUpdatePostRequestParams = ICreatePostRequestParams & {
  postId: number;
};

export type IDeletePostRequestParams = Pick<Post, 'id'>;

export type ICreateCategoryRequestParams = Pick<
  Category,
  'name' | 'thumbnailId' | 'url'
>;

export type IGetCategoryRequestParams = Pick<User, 'nickname'>;

export type IUpdateCategoryRequestParams = ICreateCategoryRequestParams & {
  categoryId: number;
};

export type IDeleteCategoryRequestParams = IDeletePostRequestParams;

export type IGetTagListRequestParams = Pick<User, 'nickname'>;
