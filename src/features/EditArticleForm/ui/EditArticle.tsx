import styles from "./EditArticle.module.scss";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
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
  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tagList" as never,
  });

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
      replace(article.tagList || []);
    }
  }, [article, reset, replace]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      append(newTag.trim());
      setNewTag("");
    }
  };

  const onSubmit = (formData: EditArticleData) => {
    if (!slug) return;
    editArticleMutation.mutate(
      {
        slug,
        data: formData,
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
              {fields.map((field, index) => (
                <div key={field.id} className={styles.tagItem}>
                  <TextInput name={`tagList.${index}`} sx={{ width: 300 }} />
                  <Button variant="outlined" color="error" onClick={() => remove(index)}>
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
