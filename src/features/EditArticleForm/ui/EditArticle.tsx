import styles from "./EditArticle.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, FormControl, FormHelperText, Button } from "@mui/material";
import { editArticleSchema } from "../model/schema";
import { EditArticleData } from "../model/types";
import { useState, useEffect } from "react";
import { fetchArticle } from "../model/hooks/useArticle";
import { useEditArticle } from "../model";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const EditArticleForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EditArticleData>({
    resolver: zodResolver(editArticleSchema),
    mode: "onSubmit",
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug!),
    enabled: !!slug,
  });

  const editArticleMutation = useEditArticle(reset);

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description,
        body: article.body,
      });
      setTags(article.tagList || []);
    }
  }, [article, reset]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (formData: EditArticleData) => {
    if (!slug) return;
    editArticleMutation.mutate(
      {
        slug,
        data: {
          ...formData,
          tagList: tags,
        },
      },
      {
        onSuccess: () => {
          navigate(`/article/${slug}`);
        },
        onError: (error: AxiosError) => {
          console.error("Failed to update article:", error);
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.editArticleContainer}>
      <span className={styles.formName}>Edit article</span>

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
                  onChange={(e) => {
                    const updatedTags = [...tags];
                    updatedTags[index] = e.target.value;
                    setTags(updatedTags);
                  }}
                  value={tag}
                  sx={{ width: 300 }}
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

export default EditArticleForm;
