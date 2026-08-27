export const has = (group, id) =>
  group.some((p) => p.id === id);

export const onlyPair = (group, a, b) =>
  group.length === 2 &&
  has(group, a) &&
  has(group, b);

export const onlyTriple = (group, a, b, c) =>
  group.length === 3 &&
  has(group, a) &&
  has(group, b) &&
  has(group, c);

export const hannaKillsHonoka = () => ({
  title: (
    <span className="red-text">
      黒部ホノカ 死亡
    </span>
  ),

  message: (
    <>
      <span className="yellow-text">
        遠野ハンナ
      </span>
      が
      <span className="yellow-text">
        黒部ホノカ
      </span>
      を包丁で
      <span className="red-text">
        刺殺
      </span>
      しました。
    </>
  ),

  effect: "hanna-stab",
  stabTarget: "honoka",
  badVoice:
    "/bad_voices/bad_hanna_honoka_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

export const drown = (person, label) => ({
  title: (
    <span className="red-text">
      {label} 死亡
    </span>
  ),

  message: (
    <>
      <span className="yellow-text">
        {label}
      </span>
      が一人で船を漕ごうとして、
      <span className="red-text">
        溺死
      </span>
      しました。
    </>
  ),

  effect: "character-drown",
  drownTarget: person,
  badVoice:
    person === "ema"
      ? "/bad_voices/bad_ema_drown.mp3"
      : person === "hanna"
        ? "/bad_voices/bad_hanna_drown.mp3"
        : person === "coco"
          ? "/bad_voices/bad_coco_drown.mp3"
          : undefined,
  badVoiceVolume: person === "coco" ? 4 : 2.2,
  delay: 1200,
});
