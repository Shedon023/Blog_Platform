import styles from "./EditArticle.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, CircularProgress } from "@mui/material";
import { editArticleSchema } from "../model/schema";
import { EditArticleData } from "../model/types";
import { useState, useEffect } from "react";
import { fetchArticle } from "../../../shared/api/services/article-service";
import { useEditArticle } from "../model";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { TextInput } from "@/shared/ui/TextInput";

const EditArticleForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const methods = useForm<EditArticleData>({
    resolver: zodResolver(editArticleSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });
  const { handleSubmit, reset } = methods;
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug!),
    enabled: !!slug,
  });

  const editArticleMutation = useEditArticle();

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
    <div className={styles.editArticleContainer}>
      <span className={styles.formName}>Edit article</span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.forms}>
            <TextInput
              name="title"
              label="Title"
              placeholder="Title"
              variant="outlined"
              autoComplete="title"
              sx={{ width: 874 }}
            />

            <TextInput
              name="description"
              label="Description"
              placeholder="description"
              variant="outlined"
              autoComplete="description"
            />

            <TextInput
              className={styles.textInput}
              name="body"
              placeholder="Text"
              autoComplete="text"
              multiline
              minRows={4}
              maxRows={20}
              sx={{
                "& .MuiOutlinedInput-root": {
                  alignItems: "flex-start",
                },
              }}
            />

            <div className={styles.tagsContainer}>
              <span className={styles.tagsLabel}>Tags</span>
              {tags.map((tag, index) => (
                <div key={index} className={styles.tagItem}>
                  <TextInput
                    name="tagList"
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
                <TextInput
                  className={styles.tagInput}
                  name="tagList"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tag"
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
      </FormProvider>
    </div>
  );
};

export default EditArticleForm;
