import styles from "./NewArticle.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, CircularProgress } from "@mui/material";
import { newArticleSchema } from "../model/schema";
import { NewArticleData } from "../model/types";
import { useState } from "react";
import { useNewArticle } from "../model/hooks/useNewArticle";
import { TextInput } from "@/shared/ui/TextInput";

const NewArticleForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const methods = useForm<NewArticleData>({
    resolver: zodResolver(newArticleSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });

  const { handleSubmit, setError } = methods;

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

export default NewArticleForm;
