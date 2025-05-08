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
} from "@mui/material";
import { useArticle } from "../model/hooks/useArticle"; //
import { useDeleteArticle } from "@/features/DeleteArticle/model/hooks";
import React, { useState } from "react";

import Markdown from "markdown-to-jsx";
import { useGetUser } from "../model/hooks/useGetUser";
import { Loader } from "@/shared/ui/Loader";
import FavoriteButton from "@/features/Toggle-favorite/ui/FavoriteButton";

type ArticleProps = {
  actionSlot?: (params: {
    slug: string;
    favorited: boolean;
    favoritesCount: number;
    onToggleFavorite: () => void;
  }) => React.ReactNode;
};

const Article = ({ actionSlot }: ArticleProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error } = useArticle(slug!);
  const { data: user } = useGetUser();
  const { deleteArticle } = useDeleteArticle();

  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return <Loader />;
  if (isError) return <div>Ошибка: {(error as Error).message}</div>;
  if (!article) return <div>Статья не найдена</div>;

  const isAuthor = user?.username === article.author.username;

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
                  <FavoriteButton
                    slug={article.slug}
                    initialFavorited={article.favorited}
                    initialCount={article.favoritesCount}
                  />
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
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this article?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Article;
