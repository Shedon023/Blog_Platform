import { useEffect, useState } from "react";
import { useArticleList } from "../model/hooks/useArticleList";
import styles from "./ArticleList.module.scss";
import { Card, CardContent, Typography, Box, Avatar, Pagination } from "@mui/material";
import { ArticleType } from "../model/types";
import { Link, useSearchParams } from "react-router-dom";
import { Loader } from "@/shared/ui/Loader";
import FavoriteButton from "@/features/Toggle-favorite/ui/FavoriteButton";

const ArticleList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const articlesPerPage = 5;

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  const { data, isLoading, error } = useArticleList(currentPage, articlesPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <Box className={styles.articleListContainer}>
      {data.articles.map((article: ArticleType) => {
        return (
          <Card key={article.slug} className={styles.articleCard}>
            <CardContent className={styles.cardContent}>
              <Box className={styles.mainContent}>
                <Box className={styles.likesCount}>
                  <Typography
                    variant="h5"
                    component={Link}
                    to={`/article/${article.slug}`}
                    className={styles.articleTitle}
                  >
                    {article.title}
                  </Typography>
                  <FavoriteButton
                    slug={article.slug}
                    initialFavorited={article.favorited}
                    initialCount={article.favoritesCount}
                  />
                </Box>

                <Box className={styles.tagContainer}>
                  {article.tagList.map((tag: string, index: number) => (
                    <span key={index} className={styles.articleTag}>
                      {tag}
                    </span>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" className={styles.articleDescription}>
                  {article.description}
                </Typography>
              </Box>

              <Box className={styles.cardHeader}>
                <Avatar alt={article.author.username} src={article.author.image} className={styles.avatar} />
                <Box>
                  <Typography variant="body2" color="text.primary" className={styles.articleAuthor}>
                    <strong>{article.author.username}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" className={styles.articleDate}>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
      <Pagination
        count={Math.round(data.articlesCount / articlesPerPage)}
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
