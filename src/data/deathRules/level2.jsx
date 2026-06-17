import {
  has,
  onlyPair,
  onlyTriple,
  hannaKillsHonoka,
  drown,
} from "./shared.jsx";

export const getDeathReasonLevel2 = (
  group,
  phase,
  context = {}
) => {
  if (
    phase === "center" &&
    context.place === "boat"
  ) {
    if (
      group.length === 1 &&
      has(group, "ema")
    ) {
      return drown("ema", "桜羽エマ");
    }

    if (
      group.length === 1 &&
      has(group, "hanna")
    ) {
      return drown("hanna", "遠野ハンナ");
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

    if (onlyPair(group, "hanna", "honoka")) {
      return hannaKillsHonoka();
    }

    if (
      has(group, "honoka") &&
      group.length === 2
    ) {
      const victim = group.find(
        (p) => p.id !== "honoka"
      );

      return {
        title: (
          <span className="red-text">
            {victim.name} 死亡
          </span>
        ),

        message: (
          <>
            <span className="yellow-text">
              黒部ホノカ
            </span>
            が、同乗者の
            <span className="yellow-text">
              {victim.name}
            </span>
            を鎌で
            <span className="red-text">
              斬殺
            </span>
            しました。
          </>
        ),

        effect: "honoka-slash",
        slashTarget: victim.id,
        badVoice:
          `/bad_voices/bad_honoka_${victim.id}_kill.mp3`,
        badVoiceVolume: 2.2,
        delay: 1200,
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
          が2人きりになり、ヒロがエマを
          <span className="red-text">
            撲殺
          </span>
          しました。
        </>
      ),

      effect: "hiro-smash",
      badVoice:
        "/bad_voices/bad_hiro_ema_kill.mp3",
      badVoiceVolume: 2.2,
      delay: 1200,
    };
  }

  if (onlyPair(group, "hanna", "honoka")) {
    return hannaKillsHonoka();
  }

  if (
    context.side === "right" &&
    onlyTriple(group, "hanna", "hiro", "honoka")
  ) {
    return hannaKillsHonoka();
  }

  if (onlyPair(group, "honoka", "sherry")) {
    return {
      title: (
        <span className="red-text">
          橘シェリー 死亡
        </span>
      ),

      message: (
        <>
          <span className="yellow-text">
            黒部ホノカ
          </span>
          と
          <span className="yellow-text">
            橘シェリー
          </span>
          が2人きりになり、ホノカがシェリーを鎌で
          <span className="red-text">
            斬殺
          </span>
          しました。
        </>
      ),

      effect: "honoka-slash",
      slashTarget: "sherry",
      badVoice:
        "/bad_voices/bad_honoka_sherry_kill.mp3",
      badVoiceVolume: 2.2,
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
          こちら岸に
          <span className="yellow-text">
            桜羽エマ
          </span>
          が一人きりで残されたため、
          <span className="red-text">
            自殺
          </span>
          しました。
        </>
      ),

      badVoice:
        "/bad_voices/bad_ema_suicide.mp3",
      badVoiceVolume: 2.2,
      effect: "ema-suicide",
      delay: 1200,
    };
  }

  return null;
};