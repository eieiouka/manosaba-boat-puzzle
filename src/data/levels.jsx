import { CHARACTERS } from "./characters.jsx";

const LEVEL_CHARACTER_OVERRIDES = {
  2: {
    hanna: {
      condition: (
        <>
          船の漕ぎ方もロクに分からないので、一人で乗ると
          <span className="red-text">溺死</span>
          します。
          <br />

          <span className="yellow-text">黒部ホノカ</span>
          と2人きりになると、ホノカを包丁で
          <span className="red-text">刺殺</span>
          します。
          <br />

          向こう岸では、
          <span className="yellow-text">二階堂ヒロ</span>
          が止めようとしても（岸に3人）、同じく
          <span className="red-text">刺殺</span>
          します。
          <br />

          本人は、「ホノカさんが鎌を持っていたのが原因。これは正当防衛」と主張しています。
        </>
      ),
    },
  },
};

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