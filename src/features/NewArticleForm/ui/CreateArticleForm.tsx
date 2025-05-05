import styles from "./CreateArticle.module.scss";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Box, CircularProgress } from "@mui/material";
import { newArticleSchema } from "../model/schema";
import { NewArticleData } from "../model/types";
import { useNewArticle } from "../model/hooks/useNewArticle";
import { TextInput } from "@/shared/ui/TextInput";

const CreateArticleForm = () => {
  const defaultValues = newArticleSchema.parse({});

  const methods = useForm<NewArticleData>({
    resolver: zodResolver(newArticleSchema),
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const { control, handleSubmit, setError } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList" as never,
  });

  const handleAddTag = () => {
    append("");
  };

  const { createArticle, isLoading } = useNewArticle(setError);

  const onSubmit = async (data: NewArticleData) => {
    const filteredTags = data.tagList?.filter((tag) => tag?.trim()) || [];

    try {
      await createArticle({ ...data, tagList: filteredTags });
    } catch (error) {}
  };

  const tagValues = useWatch({
    control,
    name: "tagList",
    defaultValue: [],
  });

  const hasEmptyTag = tagValues?.some((tag) => !tag?.trim());

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
              {fields.map((field, index) => (
                <div key={field.id} className={styles.tagItem}>
                  <TextInput name={`tagList.${index}`} sx={{ width: 300 }} />
                  <Button variant="outlined" color="error" onClick={() => remove(index)}>
                    Delete
                  </Button>
                </div>
              ))}

              <div className={styles.tagInputGroup}>
                <Button variant="outlined" onClick={handleAddTag} disabled={hasEmptyTag}>
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

export default CreateArticleForm;
