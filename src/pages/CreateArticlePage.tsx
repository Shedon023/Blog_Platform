import ArticleForm from "@/features/ArticleForm/ui/CreateOrEditArticleForm";
import { useParams } from "react-router-dom";

const CreateArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  return <ArticleForm slug={slug} mode="create" />;
};

export default CreateArticlePage;
