import { useEffect, useState } from "react";
import { useFavorite } from "../model/hooks/useFavorite";
import { useUnfavorite } from "../model/hooks/useUnfavorite";
import Checkbox from "@mui/material/Checkbox";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useGetUser } from "@/pages/Article/model/hooks/useGetUser";
import { FavoriteButtonProps } from "../model/types";

const FavoriteButton = ({ slug, initialFavorited, initialCount }: FavoriteButtonProps) => {
  const [localFavorites, setLocalFavorites] = useState<Record<string, { favorited: boolean; count: number }>>({});
  const favoriteMutation = useFavorite();
  const unfavoriteMutation = useUnfavorite();
  const { data: user } = useGetUser();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("articleFavorites");
    if (savedFavorites) {
      setLocalFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("articleFavorites", JSON.stringify(localFavorites));
  }, [localFavorites]);

  const handleFavoriteChange = () => {
    if (!user) return;

    const currentState = localFavorites[slug] || {
      favorited: initialFavorited,
      count: initialCount,
    };

    const newFavorited = !currentState.favorited;
    const newCount = newFavorited ? currentState.count + 1 : currentState.count - 1;

    setLocalFavorites((prev) => ({
      ...prev,
      [slug]: {
        favorited: newFavorited,
        count: newCount,
      },
    }));

    if (newFavorited) {
      favoriteMutation.mutate(slug);
    } else {
      unfavoriteMutation.mutate(slug);
    }
  };

  return (
    <div>
      <Checkbox
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        checked={localFavorites[slug]?.favorited || initialFavorited}
        onChange={handleFavoriteChange}
        sx={{
          color: "grey.500",
          "&.Mui-checked": {
            color: "red",
          },
        }}
      />
      <span>{localFavorites[slug]?.count || initialCount}</span>
    </div>
  );
};

export default FavoriteButton;
