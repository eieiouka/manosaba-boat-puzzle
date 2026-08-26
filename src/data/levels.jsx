import { CHARACTERS } from "./characters.jsx";
import { LEVEL_CHARACTER_OVERRIDES } from "./levelConditions.jsx";

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

  3: {
    id: 3,
    name: "レベル3",
    characterIds: [
      "ema",
      "hanna",
      "leia",
      "nanoka",
      "honoka",
    ],
  },

  4: {
    id: 4,
    name: "レベル4",
    characterIds: [
      "ema",
      "sherry",
      "hiro",
      "nanoka",
      "coco",
    ],
  },
};

export const getLevelCharacters = (levelId) => {
  const normalizedLevelId = Number(levelId);
  const level = LEVELS[normalizedLevelId];

  if (!level) {
    return [];
  }

  const overrides =
    LEVEL_CHARACTER_OVERRIDES[normalizedLevelId] || {};

  return CHARACTERS.filter((character) =>
    level.characterIds.includes(character.id)
  ).map((character) => ({
    ...character,
    ...(overrides[character.id] || {}),
  }));
};
