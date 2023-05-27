declare module 'ApiResponse' {
  interface ICategoryListAPIResponse {
    id: number;
    name: string;
    url: string;
    thumbnailId: string;
  }

  interface IPostListAPIResponse {
    id: number;
    url: string;
    userId: string;
    title: string;
    description: string;
    thumbnailId: string;
    content: string;
    isPrivate: boolean;
    categoryId: number | null;
    createdAt: Date;
    updateAt: Date;
    tag: {
      tagName: string;
    }[];
  }

  interface IPostDetailAPIResponse {
    tag: {
      tagName: string;
    }[];
    category: {
      name: string;
    } | null;
    id: number;
    title: string;
    content: string;
  }
}
