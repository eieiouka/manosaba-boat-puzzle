const has = (group, id) =>
  group.some((p) => p.id === id);

const onlyPair = (group, a, b) =>
  group.length === 2 &&
  has(group, a) &&
  has(group, b);

export const getDeathReason = (
  group,
  phase,
  context = {}
) => {
  const allPeople = context.allPeople || [];

  if (
    phase === "center" &&
    context.place === "boat"
  ) {
    if (
      group.length === 1 &&
      has(group, "ema")
    ) {
      return {
        title: (
          <span className="red-text">
            エマ死亡
          </span>
        ),

        message: (
          <>
            桜羽エマが一人で船を漕ごうとして、
            <span className="red-text">
              溺死
            </span>
            しました。
          </>
        ),

        delay: 800,
      };
    }

    if (
      group.length === 1 &&
      has(group, "hanna")
    ) {
      return {
        title: (
          <span className="red-text">
            遠野ハンナ 死亡
          </span>
        ),

        message: (
          <>
            遠野ハンナが一人で船を漕ごうとして、
            <span className="red-text">
              溺死
            </span>
            しました。
          </>
        ),

        delay: 800,
      };
    }

    if (
      has(group, "sherry") &&
      !has(group, "ema") &&
      !has(group, "hanna")
    ) {
      return {
        title: (
          <span className="red-text">
            橘シェリー 死亡
          </span>
        ),

        message: (
          <>
            橘シェリーが
            <span className="yellow-text">
              桜羽エマ
            </span>
            か
            <span className="yellow-text">
              遠野ハンナ
            </span>
            と同席していないため、
            船を壊して
            <span className="red-text">
              溺死
            </span>
            しました。
          </>
        ),

        effect: "boat-break",

        badVoice:
          "/bad_voices/bad_sherry_boat.mp3",

        badVoiceVolume: 2.2,

        delay: 1100,
      };
    }
  }

  if (onlyPair(group, "hiro", "ema")) {
    return {
      title: (
        <span className="red-text">
          桜羽エマ 死亡
        </span>
      ),

      message: (
        <>
          <span className="yellow-text">
            二階堂ヒロ
          </span>
          と
          <span className="yellow-text">
            桜羽エマ
          </span>
          が2人きりになり、
          ヒロがエマを
          <span className="red-text">
            殺害
          </span>
          しました。
        </>
      ),

      delay: 1200,
    };
  }

  if (
    onlyPair(group, "hanna", "nanoka")
  ) {
    return {
      title: (
        <span className="red-text">
          黒部ナノカ 死亡
        </span>
      ),

      message: (
        <>
          <span className="yellow-text">
            遠野ハンナ
          </span>
          と
          <span className="yellow-text">
            黒部ナノカ
          </span>
          が2人きりになり、
          ハンナがナノカを包丁で
          <span className="red-text">
            刺殺
          </span>
          しました。
        </>
      ),

      delay: 1200,
    };
  }

  if (
    context.side === "left" &&
    group.length === 1 &&
    has(group, "ema")
  ) {
    return {
      title: (
        <span className="red-text">
          桜羽エマ 死亡
        </span>
      ),

      message: (
        <>
          こちら岸に桜羽エマが一人きりで残されたため、
          <span className="red-text">
            自殺
          </span>
          しました。
        </>
      ),

      delay: 1500,
    };
  }

  if (
    has(group, "nanoka") &&
    !has(group, "sherry") &&
    !has(group, "hiro") &&
    has(allPeople, "ema")
  ) {
    return {
      title: (
        <span className="red-text">
          桜羽エマ 死亡
        </span>
      ),

      message: (
        <>
          ナノカのいる場所に
          <span className="yellow-text">
            橘シェリー
          </span>
          も
          <span className="yellow-text">
            二階堂ヒロ
          </span>
          もいなかったため、桜羽エマを
          <span className="red-text">
            銃殺
          </span>
          しました。
        </>
      ),

      effect: "nanoka-shot",

      badVoice:
        "/bad_voices/bad_nanoka_ema_kill.mp3",

      badVoiceVolume: 2.2,

      delay: 900,
    };
  }

  return null;
};