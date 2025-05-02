import { useEffect, useState } from "react";
import { useArticleList } from "../model/hooks/useArticleList";
import styles from "./ArticleList.module.scss";
import { Card, CardContent, Typography, Box, Avatar, Pagination, CircularProgress } from "@mui/material";
import { ArticleType } from "../model/types";
import { Link, useSearchParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useFavorite } from "../model/hooks/useFavorite";
import { useUnfavorite } from "../model/hooks/useUnfavorite";
import { useGetUser } from "@/pages/Article/model/hooks/useGetUser";

const ArticleList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const { data: user } = useGetUser();
  const articlesPerPage = 5;
  const favoriteMutation = useFavorite();
  const unfavoriteMutation = useUnfavorite();

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  const [localFavorites, setLocalFavorites] = useState<Record<string, { favorited: boolean; count: number }>>({});
  const { data, isLoading, error } = useArticleList(currentPage, articlesPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
  };

  const getFavoritedState = (slug: string) => {
    if (localFavorites[slug]) {
      return localFavorites[slug];
    }
    const article = data.articles.find((a: ArticleType) => a.slug === slug);
    return {
      favorited: article?.favorited || false,
      count: article?.favoritesCount || 0,
    };
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("articleFavorites");
    if (savedFavorites) {
      setLocalFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("articleFavorites", JSON.stringify(localFavorites));
  }, [localFavorites]);

  const handleFavoriteChange = (slug: string) => {
    if (!user) return;
    const currentState = getFavoritedState(slug);
    const newFavorited = !currentState.favorited;
    const newCount = newFavorited ? currentState.count + 1 : currentState.count - 1;

    setLocalFavorites((prev) => ({
      ...prev,
      [slug]: {
        favorited: newFavorited,
        count: newCount,
      },
    }));

    if (newFavorited) {
      favoriteMutation.mutate(slug);
    } else {
      unfavoriteMutation.mutate(slug);
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <Box className={styles.articleListContainer}>
      {data.articles.map((article: ArticleType) => {
        const { favorited, count } = getFavoritedState(article.slug);

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
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={favorited}
                    onChange={() => handleFavoriteChange(article.slug)}
                    sx={{
                      color: "grey.500",
                      "&.Mui-checked": {
                        color: "red",
                      },
                      padding: 0,
                      marginRight: 0,
                    }}
                  />
                  <Typography variant="body2">{count}</Typography>
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
