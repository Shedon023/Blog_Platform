import { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ArcticleList from "@/pages/ArticleList/ui/ArticleList";
import SignUpPage from "@/pages/SignUpPage";
import SignInPage from "@/pages/SignInPage";
import EditProfilePage from "@/pages/EditProfilePage";
import NewArticlePage from "@/pages/NewArticlePage";
import MainLayout from "../layout/MainLayout";
import Article from "@/pages/Article/ui/Article";

import EditArticlePage from "@/pages/EditArticlePage";
type RouterProviderProps = {
  children: ReactNode;
};

const RouterProvider = ({ children }: RouterProviderProps) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ArcticleList />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="editProfile" element={<EditProfilePage />} />
          <Route path="newArticle" element={<NewArticlePage />} />
          <Route path="editArticle/:slug" element={<EditArticlePage />} />
        </Route>
      </Routes>
      {children}
    </BrowserRouter>
  );
};

export { RouterProvider };
