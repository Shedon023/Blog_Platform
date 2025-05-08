import CreateOrEditArticleForm from "@/features/CreateOrEditArticleForm/ui/CreateOrEditArticleForm";
import { useParams } from "react-router-dom";

const CreateArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  return <CreateOrEditArticleForm slug={slug} mode="create" />;
};

export default CreateArticlePage;
