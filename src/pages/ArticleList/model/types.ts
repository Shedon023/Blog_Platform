export type ArticleType = {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  favoritesCount: number;
  favorited: boolean;
  author: {
    username: string;
    image: string;
  };
};
