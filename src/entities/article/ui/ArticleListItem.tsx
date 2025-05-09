import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./ArticleListItem.module.scss";
// import { useState } from "react";

type ArticleListItemProps = {
  slug: string;
  tagList: string[];
  actionSlot: React.ReactNode;
  title: string;
  description: string;
  username: string;
  image: string;
  createdAt: string;
  // actionSlot: (count : number) => React.ReactNode
};

export const ArticleListItem = ({
  slug,
  tagList,
  actionSlot,
  title,
  description,
  username,
  createdAt,
  image,
}: ArticleListItemProps) => {
  // const {count, setCount} = useState(0)

  return (
    <Card className={styles.articleCard}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.mainContent}>
          <Box className={styles.likesCount}>
            <Typography variant="h5" component={Link} to={`/article/${slug}`} className={styles.articleTitle}>
              {title}
            </Typography>
            {/* {actionSlot(count)} */}
            {actionSlot}
          </Box>

          <Box className={styles.tagContainer}>
            {tagList.map((tag: string, index: number) => (
              <span key={index} className={styles.articleTag}>
                {tag}
              </span>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" className={styles.articleDescription}>
            {description}
          </Typography>
        </Box>

        <Box className={styles.cardHeader}>
          <Avatar alt={username} src={image} className={styles.avatar} />
          <Box>
            <Typography variant="body2" color="text.primary" className={styles.articleAuthor}>
              <strong>{username}</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary" className={styles.articleDate}>
              {new Date(createdAt).toLocaleDateString("en-US", {
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
};
