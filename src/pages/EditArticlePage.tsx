import EditArticleForm from "@/features/EditArticleForm/ui/EditArticle";
import { useParams } from "react-router-dom";

const EditProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div>
      <EditArticleForm slug={slug} />
    </div>
  );
};

export default EditProfilePage;
