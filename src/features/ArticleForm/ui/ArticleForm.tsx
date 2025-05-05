import styles from "./EditArticle.module.scss";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, CircularProgress } from "@mui/material";
import { editArticleSchema } from "@/features/EditArticleForm/model/schema";
import { EditArticleData } from "@/features/EditArticleForm/model/types";
import { useState, useEffect } from "react";
import { TextInput } from "@/shared/ui/TextInput";
import { NewArticleData } from "@/features/NewArticleForm/model/types";
import { newArticleSchema } from "@/features/NewArticleForm/model/schema";
import { fetchArticle } from "@/shared/api/services/article-service";
import { useParams } from "react-router-dom";

type ArticleFormProps = {
  mode: "create" | "edit";
  defaultValues?: NewArticleData | EditArticleData;
  onSubmit: (data: NewArticleData | EditArticleData) => void;
  isLoading?: boolean;
};

const ArticleForm = ({ mode, defaultValues, onSubmit, isLoading }: ArticleFormProps) => {
  const [newTag, setNewTag] = useState("");
  const { slug } = useParams<{ slug: string }>();

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

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tagList" as never,
  });

  useEffect(() => {
    if (mode === "edit" && slug) {
      fetchArticle(slug).then((article) => {
        reset({
          title: article.title,
          description: article.description,
          body: article.body,
        });
        replace(article.tagList || []);
      });
    }
  }, [mode, slug, reset, replace]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      append(newTag.trim());
      setNewTag("");
    }
  };

  const internalSubmit = (formData: any) => {
    onSubmit({
      ...formData,
    });
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
        <form onSubmit={handleSubmit(internalSubmit)}>
          {" "}
          // ????????
          <div className={styles.forms}>
            <TextInput name="title" label="Title" placeholder="Title" autoComplete="title" />

            <TextInput name="description" label="Description" placeholder="description" autoComplete="description" />

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

export default ArticleForm;
