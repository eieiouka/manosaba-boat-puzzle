import {
  has,
  onlyPair,
  onlyTriple,
  drown,
} from "./shared.jsx";

const leiaDiesAlone = () => ({
  title: (
    <span className="red-text">
      蓮見レイア 魔女化
    </span>
  ),

  message: (
    <>
      <span className="yellow-text">
        蓮見レイア
      </span>
      が一人きりになり、誰にも見られていないことに耐えられず
      <span className="red-text">
        魔女化
      </span>
      しました。
    </>
  ),

  badVoice: "/bad_voices/bad_leia_majoka.mp3",
  badVoiceVolume: 2,
  effect: "leia-majoka",
  delay: 1200,
});

const hannaKillsLeia = () => ({
  title: (
    <span className="red-text">
      蓮見レイア 死亡
    </span>
  ),

  message: (
    <>
      <span className="yellow-text">
        遠野ハンナ
      </span>
      と
      <span className="yellow-text">
        蓮見レイア
      </span>
      が岸で2人きりになり、ハンナがレイアを岩で
      <span className="red-text">
        撲殺
      </span>
      しました。
    </>
  ),

  delay: 1200,
});

const nanokaKillsEma = () => ({
  title: (
    <span className="red-text">
      桜羽エマ 死亡
    </span>
  ),

  message: (
    <>
      <span className="yellow-text">
        黒部ナノカ
      </span>
      が見張りのいない隙に、
      <span className="yellow-text">
        桜羽エマ
      </span>
      を
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
  delay: 1200,
});

const honokaKills = (victim) => ({
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
      が
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
});

const honokaKillsLeia = () => ({
  title: (
    <span className="red-text">
      蓮見レイア 死亡
    </span>
  ),

  message: (
    <>
      こちら岸で
      <span className="yellow-text">
        黒部ホノカ
      </span>
      ・
      <span className="yellow-text">
        黒部ナノカ
      </span>
      ・
      <span className="yellow-text">
        蓮見レイア
      </span>
      の3人だけになり、ホノカがレイアを鎌で
      <span className="red-text">
        斬殺
      </span>
      しました。
    </>
  ),

  effect: "honoka-slash",
  slashTarget: "leia",
  badVoice:
    "/bad_voices/bad_honoka_leia_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const isNanokaWatched = (group) =>
  has(group, "leia") || has(group, "honoka");

const isLeiaProtectingEmaInBoat = (group) =>
  has(group, "leia") && has(group, "ema");

const shouldNanokaShootEma = (
  group,
  context
) => {
  if (!has(group, "nanoka")) return false;

  if (isNanokaWatched(group)) return false;

  if (context.place === "boat") {
    return (
      !isLeiaProtectingEmaInBoat(group) &&
      context.allPeople?.some((p) => p.id === "ema")
    );
  }

  return has(group, "ema");
};

export const getDeathReasonLevel3 = (
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
      group.length === 1 &&
      has(group, "leia")
    ) {
      return leiaDiesAlone();
    }

    if (
      shouldNanokaShootEma(group, context)
    ) {
      return nanokaKillsEma();
    }

    if (
      has(group, "honoka") &&
      group.length === 2 &&
      !has(group, "nanoka")
    ) {
      const victim = group.find(
        (p) => p.id !== "honoka"
      );

      return honokaKills(victim);
    }
  }

  if (
    group.length === 1 &&
    has(group, "leia")
  ) {
    return leiaDiesAlone();
  }

  if (
    context.place !== "boat" &&
    onlyPair(group, "hanna", "leia")
  ) {
    return hannaKillsLeia();
  }

  if (
    onlyPair(group, "honoka", "ema")
  ) {
    const ema = group.find(
      (p) => p.id === "ema"
    );

    return honokaKills(ema);
  }

  if (
    context.side === "left" &&
    onlyTriple(group, "leia", "nanoka", "honoka")
  ) {
    return honokaKillsLeia();
  }

  if (
    shouldNanokaShootEma(group, context)
  ) {
    return nanokaKillsEma();
  }

  return null;
};