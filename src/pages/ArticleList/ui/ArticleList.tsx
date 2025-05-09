import { useEffect, useState } from "react";
import { useArticleList } from "../model/hooks/useArticleList";
import styles from "./ArticleList.module.scss";
import { Box, Pagination } from "@mui/material";
import { ArticleType } from "../model/types";
import { useSearchParams } from "react-router-dom";
import { Loader } from "@/shared/ui/Loader";
import FavoriteButton from "@/features/Toggle-favorite/ui/FavoriteButton";
import { ArticleListItem } from "@/entities/article/ui/ArticleListItem";

const ARTICLES_PER_PAGE = 5 as const;

const ArticleList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  const { data, isLoading, error } = useArticleList(currentPage, ARTICLES_PER_PAGE);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!data) return <div>Данные не загружены</div>;

  return (
    <Box className={styles.articleListContainer}>
      {data.articles.map((article: ArticleType) => {
        return (
          <ArticleListItem
            key={article.slug}
            slug={article.slug}
            tagList={article.tagList}
            createdAt={article.createdAt}
            description={article.description}
            image={article.author.image}
            title={article.title}
            username={article.author.username}
            actionSlot={
              <FavoriteButton
                slug={article.slug}
                initialCount={article.favoritesCount}
                initialFavorited={article.favorited}
              />
            }
          />
        );
      })}
      <Pagination
        count={Math.round(data.articlesCount / ARTICLES_PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        variant="outlined"
        shape="rounded"
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default ArticleList;
