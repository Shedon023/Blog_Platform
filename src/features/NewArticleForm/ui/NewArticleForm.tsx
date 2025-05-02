import styles from "./NewArticle.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, FormControl, FormHelperText, Button, Box, CircularProgress } from "@mui/material";
import { newArticleSchema } from "../model/schema";
import { NewArticleData } from "../model/types";
import { useState } from "react";
import { useNewArticle } from "../model/hooks/useNewArticle";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const NewArticleForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<NewArticleData>({
    resolver: zodResolver(newArticleSchema),
    mode: "onSubmit",
  });

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const { createArticle, isLoading } = useNewArticle(setError);

  const onSubmit = async (data: NewArticleData) => {
    const formData = { ...data, tagList: tags };
    try {
      await createArticle(formData);
    } catch (error) {}
  };

  if (isLoading) {
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
  }

  return (
    <div className={styles.newArticleContainer}>
      <span className={styles.formName}>Create new article</span>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.forms}>
          <FormControl margin="normal" error={!!errors.title}>
            <TextField
              label="Title"
              {...register("title")}
              placeholder="Title"
              variant="outlined"
              autoComplete="title"
              sx={{ width: 874 }}
            />
            {errors.title && typeof errors.title.message === "string" && (
              <FormHelperText>{errors.title.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.description}>
            <TextField
              label="Description"
              {...register("description")}
              placeholder="description"
              variant="outlined"
              autoComplete="description"
            />
            {errors.description && typeof errors.description.message === "string" && (
              <FormHelperText>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.body}>
            <TextareaAutosize
              {...register("body")}
              style={{
                height: 200,
                fontSize: 17,
                padding: 10,
                resize: "none",
                overflowY: "auto",
              }}
              placeholder="Text"
              autoComplete="text"
            />
            {errors.body && typeof errors.body.message === "string" && (
              <FormHelperText>{errors.body.message}</FormHelperText>
            )}
          </FormControl>

          <div className={styles.tagsContainer}>
            <span className={styles.tagsLabel}>Tags</span>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagItem}>
                <TextField
                  value={tag}
                  sx={{ width: 300 }}
                  onChange={(e) => {
                    const updatedTags = [...tags];
                    updatedTags[index] = e.target.value;
                    setTags(updatedTags);
                  }}
                />
                <Button variant="outlined" color="error" onClick={() => handleDeleteTag(index)}>
                  Delete
                </Button>
              </div>
            ))}

            <div className={styles.tagInputGroup}>
              <TextField
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag"
                sx={{ width: 300 }}
              />
              <Button variant="outlined" onClick={handleAddTag} disabled={!newTag.trim()}>
                Add tag
              </Button>
            </div>
          </div>

          <div className={styles.footer}>
            <Button type="submit" variant="contained" color="primary" className={styles.sendBtn}>
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewArticleForm;
