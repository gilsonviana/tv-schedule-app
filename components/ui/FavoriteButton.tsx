import { RootState } from "@/store/reducers";
import {
  FavoriteObj,
  toggleFavoriteEpisode,
  toggleFavoriteShow,
} from "@/store/reducers/favorites";
import AntDesign from "@expo/vector-icons/AntDesign";
import { findIndex } from "lodash";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface FavoriteButtonProps extends FavoriteObj {
  type: "shows" | "episodes";
}

export const FavoriteButton = ({
  id,
  image,
  name,
  type,
}: FavoriteButtonProps) => {
  const { favoriteShows, favoriteEpisodes } = useSelector(
    (state: RootState) => state.favorites
  );
  const dispatch = useDispatch();
  const isFavorite =
    findIndex(type === "shows" ? favoriteShows : favoriteEpisodes, { id }) >= 0;

  const handler = () => {
    dispatch(
      type === "shows"
        ? toggleFavoriteShow({ id, image, name })
        : toggleFavoriteEpisode({ id, image, name })
    );
  };

  return (
    <TouchableOpacity onPress={handler} testID="favorite-button">
      <AntDesign
        name={isFavorite ? "heart" : "hearto"}
        size={24}
        color={isFavorite ? "#f00" : "#ddd"}
      />
    </TouchableOpacity>
  );
};
