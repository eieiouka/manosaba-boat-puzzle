import { CHARACTERS } from "./characters.jsx";

export const LEVELS = {
  1: {
    id: 1,
    name: "レベル1",
    characterIds: [
      "ema",
      "sherry",
      "hanna",
      "hiro",
      "nanoka",
    ],
  },

  2: {
    id: 2,
    name: "レベル2",
    characterIds: [
      "ema",
      "sherry",
      "hanna",
      "hiro",
      "honoka",
    ],
  },
};

export const getLevelCharacters = (levelId) => {
  const level = LEVELS[levelId];

  if (!level) {
    return [];
  }

  return CHARACTERS.filter((character) =>
    level.characterIds.includes(character.id)
  );
};