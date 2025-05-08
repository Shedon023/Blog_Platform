export type ArticleProps = {
  actionSlot?: (params: {
    slug: string;
    favorited: boolean;
    favoritesCount: number;
    onToggleFavorite: () => void;
  }) => React.ReactNode;
};
