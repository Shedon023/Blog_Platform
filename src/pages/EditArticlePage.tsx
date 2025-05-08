import ArticleForm from "@/features/ArticleForm/ui/CreateOrEditArticleForm";
import { useParams } from "react-router-dom";

const EditProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  return <ArticleForm slug={slug} mode="edit" />;
};

export default EditProfilePage;
