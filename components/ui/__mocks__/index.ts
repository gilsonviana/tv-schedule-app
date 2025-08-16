import { faker } from "@faker-js/faker";
import { TvImageObj } from "@/constants/Types";

const imageUrl = faker.image.url();

export const tvImageMock: TvImageObj = {
  original: imageUrl,
  medium: imageUrl,
};
