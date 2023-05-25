declare module 'ApiResponse' {
  interface ICategoryListAPIResponse {
    id: number;
    name: string;
    url: string;
    thumbnailId: string;
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
