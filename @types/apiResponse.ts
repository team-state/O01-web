import { Category, Post, Tag } from '@prisma/client';

export type ICategoryListAPIResponse = Pick<
  Category,
  'id' | 'name' | 'url' | 'thumbnailId'
> & {
  _count: {
    post: number;
  };
};

export type IPostListAPIResponse = Post & { tag: { tagName: string }[] };

export type IPostDetailAPIResponse =
  | (Pick<Post, 'id' | 'title' | 'content'> & {
      category: Pick<Category, 'name'> | null;
    } & {
      tag: { tagName: string }[];
    })
  | null;

export type ITagListAPIResponse = Pick<Tag, 'name'> & {
  _count: {
    post: number;
  };
};
