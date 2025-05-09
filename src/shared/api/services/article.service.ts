import { $AXIOS } from "../api";

class ArticleService {
  async getAll(page: number, limit: number) {
    return (await $AXIOS.get<ArticlesResponse>(`/articles?limit=${limit}&offset=${(page - 1) * limit}`)).data;
  }
}

export type ArticlesResponse = {
  articles: ArticleDTO[];
  articlesCount: number;
};

export type ArticleDTO = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
};

export const $ARTICLE_SERVICE = new ArticleService();
