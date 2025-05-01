import styles from "./Article.module.scss";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@mui/material";
import { useArticle } from "../model/hooks/useArticle";
import { useDeleteArticle } from "@/features/DeleteArticle/model/hooks";
import { useEffect, useState } from "react";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useFavorite } from "@/pages/ArticleList/model/hooks/useFavorite";
import { useUnfavorite } from "@/pages/ArticleList/model/hooks/useUnfavorite";
import Markdown from "markdown-to-jsx";
import { useGetUser } from "../model/hooks/useGetUser";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error } = useArticle(slug!);
  const { data: user } = useGetUser();
  const { mutate: deleteArticle } = useDeleteArticle();
  const favoriteMutation = useFavorite();
  const unfavoriteMutation = useUnfavorite();

  const [openModal, setOpenModal] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Record<string, { favorited: boolean; count: number }>>({});

  useEffect(() => {
    const savedFavorites = localStorage.getItem("articleFavorites");
    if (savedFavorites) {
      setLocalFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("articleFavorites", JSON.stringify(localFavorites));
  }, [localFavorites]);

  const handleFavoriteChange = () => {
    if (!slug) return;

    const currentState = localFavorites[slug] || {
      favorited: article?.favorited || false,
      count: article?.favoritesCount || 0,
    };

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

  if (isLoading) return <h3>Загрузка...</h3>;
  if (isError) return <div>Ошибка: {(error as Error).message}</div>;
  if (!article) return <div>Статья не найдена</div>;

  const isAuthor = user?.username === article.author.username;

  const favoriteState = localFavorites[slug!] || {
    favorited: article.favorited,
    count: article.favoritesCount,
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleDelete = () => {
    if (slug) {
      deleteArticle(slug);
    }
    handleModalClose();
  };

  return (
    <Box className={styles.articleContainer}>
      <Card className={styles.articleCard}>
        <CardContent className={styles.articleContent}>
          <Box className={styles.articleHeader}>
            <Box>
              <Box className={styles.likesCount}>
                <Typography variant="h5" className={styles.articleTitle}>
                  {article.title}
                </Typography>
                <Box className={styles.likes}>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={favoriteState.favorited}
                    onChange={handleFavoriteChange}
                    sx={{
                      color: "grey.500",
                      "&.Mui-checked": {
                        color: "red",
                      },
                      padding: 0,
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body2">{favoriteState.count}</Typography>
                </Box>
              </Box>

              <Box className={styles.tagWrapper}>
                {article.tagList.map((tag: string, index: number) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" className={styles.description}>
                {article.description}
              </Typography>
            </Box>
            <Box className={styles.authorInfo}>
              <Box>
                <Typography className={styles.username}>{article.author.username}</Typography>
                <Typography className={styles.date}>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
                {isAuthor && (
                  <Box className={styles.buttonGroup}>
                    <Button
                      className={styles.editButton}
                      variant="outlined"
                      color="success"
                      component={Link}
                      to={`/editArticle/${article.slug}`}
                    >
                      Edit
                    </Button>
                    <Button className={styles.deleteButton} variant="outlined" color="error" onClick={handleModalOpen}>
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
              <Avatar src={article.author.image} alt={article.author.username} />
            </Box>
          </Box>
          <Markdown className={styles.body}>{article.body}</Markdown>
        </CardContent>
      </Card>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту статью?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Article;
