import styles from "./ArticleForm.module.scss";
import { FormProvider, useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, CircularProgress } from "@mui/material";
import { editArticleSchema } from "@/features/EditArticleForm/model/schema";
import { EditArticleData } from "@/features/EditArticleForm/model/types";
import { useEffect } from "react";
import { TextInput } from "@/shared/ui/TextInput";
import { NewArticleData } from "@/features/NewArticleForm/model/types";
import { newArticleSchema } from "@/features/NewArticleForm/model/schema";
import { useNavigate } from "react-router-dom";
// import { useIsMounted } from "@/shared/lib/hooks/useIsMounted";
import { useNewArticle } from "@/features/NewArticleForm/model";
import { fetchArticle } from "@/shared/api/services/article-service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEditArticle } from "@/features/EditArticleForm/model";
import { ArticleFormProps } from "../model/types";

const ArticleForm = ({ mode, defaultValues, slug }: ArticleFormProps) => {
  // const isMounted = useIsMounted();
  const navigate = useNavigate();

  const methods = useForm<EditArticleData | NewArticleData>({
    resolver: zodResolver(mode === "edit" ? editArticleSchema : newArticleSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
      ...defaultValues,
    },
  });

  const { control, handleSubmit, reset, setError } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tagList" as never,
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug!),
    enabled: mode === "edit" && !!slug,
  });

  const { createArticle } = useNewArticle(setError);

  const editArticleMutation = useEditArticle();

  const handleAddTag = () => {
    append("");
  };

  useEffect(() => {
    if (mode === "edit" && article) {
      reset({
        title: article.title,
        description: article.description,
        body: article.body,
      });
      replace(article.tagList || []);
    }
  }, [article, reset, replace]);

  // if (!isMounted()) return null;

  const tagValues = useWatch({
    control,
    name: "tagList",
    defaultValue: [],
  });

  const hasEmptyTag = tagValues?.some((tag) => !tag?.trim());

  const onSubmit = async (formData: EditArticleData | NewArticleData) => {
    const filteredTags = formData.tagList?.filter((tag) => tag?.trim()) || [];

    if (mode === "create") {
      await createArticle({ ...(formData as NewArticleData), tagList: filteredTags });
    } else if (mode === "edit") {
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
    }
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
    <div className={styles.articleFormContainer}>
      <span className={styles.formName}>{mode === "edit" ? "Edit article" : "Create"}</span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.forms}>
            <TextInput className={styles.input} name="title" label="Title" placeholder="Title" autoComplete="title" />

            <TextInput
              className={styles.input}
              name="description"
              label="Description"
              placeholder="description"
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
                <Button variant="outlined" onClick={handleAddTag} disabled={mode === "create" && hasEmptyTag}>
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

export default ArticleForm;
