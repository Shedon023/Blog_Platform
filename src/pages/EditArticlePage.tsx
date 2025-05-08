import CreateOrEditArticleForm from "@/features/CreateOrEditArticleForm/ui/CreateOrEditArticleForm";
import { useParams } from "react-router-dom";

const EditProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  return <CreateOrEditArticleForm slug={slug} mode="edit" />;
};

export default EditProfilePage;
