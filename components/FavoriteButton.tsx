import { TvShowDetail } from "@/constants/Types";
import { RootState } from "@/store/reducers";
import {
  toggleFavoriteEpisode,
  toggleFavoriteShow,
} from "@/store/reducers/favorites";
import AntDesign from "@expo/vector-icons/AntDesign";
import { findIndex } from "lodash";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface FavoriteButtonProps {
  type: "shows" | "episodes";
}

export const FavoriteButton = ({
  id,
  image,
  type,
}: FavoriteButtonProps & Pick<TvShowDetail, "id" | "image">) => {
  const { favoriteShows, favoriteEpisodes } = useSelector(
    (state: RootState) => state.favorites
  );
  console.log({ favoriteShows, favoriteEpisodes });
  const dispatch = useDispatch();
  const isFavorite =
    findIndex(type === "shows" ? favoriteShows : favoriteEpisodes, { id }) >= 0;

  const handler = () => {
    dispatch(
      type === "shows"
        ? toggleFavoriteShow({ id, image })
        : toggleFavoriteEpisode({ id, image })
    );
  };

  return (
    <TouchableOpacity onPress={handler}>
      <AntDesign
        name={isFavorite ? "heart" : "hearto"}
        size={24}
        color={isFavorite ? "#f00" : "#ddd"}
      />
    </TouchableOpacity>
  );
};
