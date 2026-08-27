import {
  has,
  onlyTriple,
  drown,
} from "./shared.jsx";

const nanokaKillsEma = () => ({
  title: (
    <span className="red-text">桜羽エマ 死亡</span>
  ),
  message: (
    <>
      <span className="yellow-text">二階堂ヒロ</span>
      も
      <span className="yellow-text">橘シェリー</span>
      も見張っていなかったため、
      <span className="yellow-text">黒部ナノカ</span>
      が
      <span className="yellow-text">桜羽エマ</span>
      を<span className="red-text">銃殺</span>しました。
    </>
  ),
  effect: "nanoka-shot",
  shotTarget: "ema",
  badVoice: "/bad_voices/bad_nanoka_ema_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const nanokaKillsCoco = (overpowersHiro = false) => ({
  title: (
    <span className="red-text">沢渡ココ 死亡</span>
  ),
  message: (
    <>
      {overpowersHiro ? (
        <>
          向こう岸で
          <span className="yellow-text">二階堂ヒロ</span>
          の隙を突いて、
        </>
      ) : (
        <>
          <span className="yellow-text">二階堂ヒロ</span>
          も
          <span className="yellow-text">橘シェリー</span>
          も見張っていなかったため、
        </>
      )}
      <span className="yellow-text">黒部ナノカ</span>
      が<span className="yellow-text">沢渡ココ</span>を
      <span className="red-text">銃殺</span>しました。
    </>
  ),
  effect: "nanoka-shot",
  shotTarget: "coco",
  badVoice: "/bad_voices/bad_nanoka_coco_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const nanokaKillsPassenger = (group) => {
  const victim = group.find((p) => p.id !== "nanoka");

  return {
    title: (
      <span className="red-text">{victim.name} 死亡</span>
    ),
    message: (
      <>
        <span className="yellow-text">黒部ナノカ</span>
        が同乗者の
        <span className="yellow-text">{victim.name}</span>
        を<span className="red-text">銃殺</span>しました。
      </>
    ),
    effect: "nanoka-shot",
    shotTarget: victim.id,
    badVoice: "/bad_voices/bad_nanoka_hiro_kill.mp3",
    badVoiceVolume: 2.2,
    delay: 1200,
  };
};

const sherryBreaksBoat = () => ({
  title: (
    <span className="red-text">橘シェリー 死亡</span>
  ),
  message: (
    <>
      <span className="yellow-text">桜羽エマ</span>
      が同乗していないため、橘シェリーが船を壊して
      <span className="red-text">溺死</span>しました。
    </>
  ),
  effect: "boat-break",
  badVoice: "/bad_voices/bad_sherry_boat.mp3",
  badVoiceVolume: 2.2,
  delay: 1100,
});

const checkCocoAndNanoka = (group, side) => {
  if (
    side === "right" &&
    onlyTriple(group, "coco", "hiro", "nanoka")
  ) {
    return nanokaKillsCoco(true);
  }

  if (
    has(group, "coco") &&
    has(group, "nanoka") &&
    !has(group, "hiro") &&
    !has(group, "sherry")
  ) {
    return nanokaKillsCoco(false);
  }

  return null;
};

const checkRemoteShot = (groups) => {
  const nanokaGroup = groups.findIndex(({ members }) =>
    has(members, "nanoka")
  );
  const emaGroup = groups.findIndex(({ members }) =>
    has(members, "ema")
  );
  const sherryGroup = groups.findIndex(({ members }) =>
    has(members, "sherry")
  );
  const hiroGroup = groups.findIndex(({ members }) =>
    has(members, "hiro")
  );

  if (
    hiroGroup !== nanokaGroup &&
    sherryGroup !== nanokaGroup &&
    sherryGroup !== emaGroup
  ) {
    return nanokaKillsEma();
  }

  return null;
};

export const getDeathReasonLevel4 = (
  group,
  phase,
  context = {}
) => {
  if (
    phase === "center" &&
    context.place === "boat"
  ) {
    if (group.length === 1 && has(group, "ema")) {
      return drown("ema", "桜羽エマ");
    }

    if (group.length === 1 && has(group, "coco")) {
      return drown("coco", "沢渡ココ");
    }

    if (has(group, "sherry") && !has(group, "ema")) {
      return sherryBreaksBoat();
    }

    if (
      has(group, "nanoka") &&
      has(group, "hiro") &&
      group.length === 2
    ) {
      return nanokaKillsPassenger(group);
    }

    const boatIds = new Set(group.map((p) => p.id));
    const allPeople = context.allPeople || [];
    const groups = [
      { members: group, side: "boat" },
      {
        members: allPeople.filter(
          (p) =>
            !boatIds.has(p.id) &&
            p.side === context.departureSide
        ),
        side: context.departureSide,
      },
      {
        members: allPeople.filter(
          (p) =>
            !boatIds.has(p.id) &&
            p.side === context.nextSide
        ),
        side: context.nextSide,
      },
    ];

    for (const location of groups) {
      const death = checkCocoAndNanoka(
        location.members,
        location.side
      );
      if (death) return death;
    }

    return checkRemoteShot(groups);
  }

  if (phase === "arrival") {
    return checkCocoAndNanoka(group, context.side);
  }

  return null;
};
