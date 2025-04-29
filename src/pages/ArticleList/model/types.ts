export type ArticleType = {
  slug: string;
  title: string;
  description: string;
  tagList: string[];
  createdAt: string;
  favoritesCount: number;
  favorited: boolean;
  author: {
    username: string;
    image: string;
  };
};
