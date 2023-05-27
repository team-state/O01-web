export interface ICategoryListAPIResponse {
  id: number;
  name: string;
  url: string;
  thumbnailId: string;
}

export interface IPostListAPIResponse {
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

export interface IPostDetailAPIResponse {
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

export interface ITagListAPIResponse {
  name: string;
}
