import { has, onlyPair, onlyTriple, drown } from "./shared.jsx";

const personName = (group, id) =>
  group.find((person) => person.id === id)?.name || id;

const nanokaShoots = (targetId, targetName, message) => ({
  title: <span className="red-text">{targetName} 死亡</span>,
  message,
  effect: "nanoka-shot",
  shotTarget: targetId,
  badVoice:
    targetId === "ema"
      ? "/bad_voices/bad_nanoka_ema_kill.mp3"
      : targetId === "hiro"
        ? "/bad_voices/bad_nanoka_hiro_kill.mp3"
        : targetId === "sherry"
          ? "/bad_voices/bad_nanoka_sherry_kill.mp3"
        : undefined,
  badVoiceVolume: targetId === "hiro" ? 3.08 : 2.2,
  delay: 1200,
});

const nanokaKillsEma = () =>
  nanokaShoots(
    "ema",
    "桜羽エマ",
    <>
      <span className="yellow-text">黒部ホノカ</span>
      が見ていない隙に、
      <span className="yellow-text">黒部ナノカ</span>
      が
      <span className="yellow-text">桜羽エマ</span>
      を
      <span className="red-text">銃殺</span>しました。
    </>
  );

const nanokaKillsSherry = () =>
  nanokaShoots(
    "sherry",
    "橘シェリー",
    <>
      <span className="yellow-text">黒部ホノカ</span>
      が見ていない隙に、
      <span className="yellow-text">黒部ナノカ</span>
      が近くにいた
      <span className="yellow-text">橘シェリー</span>を
      <span className="red-text">銃殺</span>
      しました。
    </>
  );

const nanokaKillsSoloHiro = () =>
  nanokaShoots(
    "hiro",
    "二階堂ヒロ",
    <>
      <span className="yellow-text">二階堂ヒロ</span>
      が一人で船に乗った隙を突き、
      <span className="yellow-text">黒部ナノカ</span>
      が
      <span className="red-text">銃殺</span>
      しました。
    </>
  );

const sherryBreaksBoat = () => ({
  title: <span className="red-text">橘シェリー 死亡</span>,
  message: (
    <>
      <span className="yellow-text">桜羽エマ</span>
      も
      <span className="yellow-text">遠野ハンナ</span>
      も同乗していないため、橘シェリーが船を壊して
      <span className="red-text">溺死</span>
      しました。
    </>
  ),
  effect: "boat-break",
  badVoice: "/bad_voices/bad_sherry_boat.mp3",
  badVoiceVolume: 2.2,
  delay: 1100,
});

const hannaStabsNanoka = () => ({
  title: <span className="red-text">黒部ナノカ 死亡</span>,
  message: (
    <>
      船で同席した
      <span className="yellow-text">遠野ハンナ</span>
      が
      <span className="yellow-text">黒部ナノカ</span>
      を包丁で
      <span className="red-text">刺殺</span>しました。
    </>
  ),
  effect: "hanna-stab",
  stabTarget: "nanoka",
  badVoice: "/bad_voices/bad_hanna_nanoka_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const hannaStabsHonoka = () => ({
  title: <span className="red-text">黒部ホノカ 死亡</span>,
  message: (
    <>
      船で同席した
      <span className="yellow-text">遠野ハンナ</span>
      が
      <span className="yellow-text">黒部ホノカ</span>
      を包丁で
      <span className="red-text">刺殺</span>
      しました。
    </>
  ),
  effect: "hanna-stab",
  stabTarget: "honoka",
  badVoice: "/bad_voices/bad_hanna_honoka_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const hannaStabsHiro = () => ({
  title: <span className="red-text">二階堂ヒロ 死亡</span>,
  message: (
    <>
      不機嫌な
      <span className="yellow-text">遠野ハンナ</span>
      と向こう岸で二人きりになったため、腹いせに
      <span className="yellow-text">二階堂ヒロ</span>
      が包丁で
      <span className="red-text">刺殺</span>
      されました。
    </>
  ),
  effect: "hanna-stab",
  stabTarget: "hiro",
  badVoice: "/bad_voices/bad_hanna_hiro_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const honokaSlashes = (group, targetId) => {
  const targetName = personName(group, targetId);
  const voiceByTarget = {
    ema: "/bad_voices/bad_honoka_ema_kill.mp3",
    sherry: "/bad_voices/bad_honoka_sherry_kill.mp3",
    hanna: "/bad_voices/bad_honoka_hanna_kill.mp3",
    hiro: "/bad_voices/bad_honoka_hiro_kill.mp3",
  };

  return {
    title: <span className="red-text">{targetName} 死亡</span>,
    message: (
      <>
        <span className="yellow-text">黒部ホノカ</span>
        が
        <span className="yellow-text">{targetName}</span>
        を鎌で
        <span className="red-text">斬殺</span>
        しました。
      </>
    ),
    effect: "honoka-slash",
    slashTarget: targetId,
    badVoice: voiceByTarget[targetId],
    badVoiceVolume: 2.2,
    delay: 1200,
  };
};

const hiroKillsEma = (jealous = false) => ({
  title: <span className="red-text">桜羽エマ 死亡</span>,
  message: jealous ? (
    <>
      <span className="yellow-text">橘シェリー</span>
      といちゃつく
      <span className="yellow-text">桜羽エマ</span>
      に嫉妬した
      <span className="yellow-text">二階堂ヒロ</span>
      が、エマを
      <span className="red-text">撲殺</span>
      しました。
    </>
  ) : (
    <>
      船で
      <span className="yellow-text">桜羽エマ</span>
      と同席した
      <span className="yellow-text">二階堂ヒロ</span>
      が殺人衝動を抑えきれず、エマを
      <span className="red-text">撲殺</span>
      しました。
    </>
  ),
  effect: "hiro-smash",
  badVoice: "/bad_voices/bad_hiro_ema_kill.mp3",
  badVoiceVolume: 2.2,
  delay: 1200,
});

const getHannaTired = (allPeople, boatGroup, afterCrossing) => {
  const hanna = allPeople.find((person) => person.id === "hanna");
  let tired = Boolean(hanna?.tired);

  if (afterCrossing && has(boatGroup, "hanna")) {
    tired = !has(boatGroup, "ema");
  }

  return tired;
};

const checkBoat = (group) => {
  if (group.length === 1 && has(group, "ema")) {
    return drown("ema", "桜羽エマ");
  }

  if (group.length === 1 && has(group, "hiro")) {
    return nanokaKillsSoloHiro();
  }

  if (
    has(group, "sherry") &&
    !has(group, "ema") &&
    !has(group, "hanna")
  ) {
    return sherryBreaksBoat();
  }

  if (has(group, "hanna") && has(group, "nanoka")) {
    return hannaStabsNanoka();
  }

  if (has(group, "hanna") && has(group, "honoka")) {
    return hannaStabsHonoka();
  }

  if (has(group, "ema") && has(group, "hiro")) {
    return hiroKillsEma();
  }

  if (has(group, "honoka") && group.length === 2) {
    const companion = group.find((person) => person.id !== "honoka");

    if (companion.id !== "nanoka") {
      return honokaSlashes(group, companion.id);
    }
  }

  return null;
};

const checkBanks = (banks, hannaTired) => {
  for (const { members, side } of banks) {
    if (onlyPair(members, "honoka", "hiro")) {
      return honokaSlashes(members, "hiro");
    }

    if (onlyTriple(members, "ema", "sherry", "hiro")) {
      return hiroKillsEma(true);
    }

    if (
      side === "right" &&
      hannaTired &&
      onlyPair(members, "hanna", "hiro")
    ) {
      return hannaStabsHiro();
    }
  }

  return null;
};

const checkNanoka = (groups) => {
  const nanokaGroup = groups.find(({ members }) =>
    has(members, "nanoka")
  );
  const emaGroup = groups.find(({ members }) => has(members, "ema"));

  if (!nanokaGroup || !emaGroup) return null;

  if (!has(nanokaGroup.members, "honoka")) {
    if (has(nanokaGroup.members, "sherry")) {
      return nanokaKillsSherry();
    }

    if (
      has(nanokaGroup.members, "ema") &&
      !has(nanokaGroup.members, "hiro")
    ) {
      return nanokaKillsEma();
    }
  }

  if (
    nanokaGroup !== emaGroup &&
    !has(nanokaGroup.members, "honoka") &&
    !has(emaGroup.members, "hiro")
  ) {
    return nanokaKillsEma();
  }

  return null;
};

export const getDeathReasonLevel5 = (group, phase, context = {}) => {
  const allPeople = context.allPeople || [];
  const boatGroup = context.boatGroup || [];

  if (phase === "center" && context.place === "boat") {
    const boatDeath = checkBoat(group);
    if (boatDeath) return boatDeath;

    const boatIds = new Set(group.map((person) => person.id));
    const departureBank = allPeople.filter(
      (person) =>
        !boatIds.has(person.id) && person.side === context.departureSide
    );
    const destinationBank = allPeople.filter(
      (person) =>
        !boatIds.has(person.id) && person.side === context.nextSide
    );
    const banks = [
      { members: departureBank, side: context.departureSide },
      { members: destinationBank, side: context.nextSide },
    ];
    const bankDeath = checkBanks(
      banks,
      getHannaTired(allPeople, group, false)
    );

    if (bankDeath) return bankDeath;

    return checkNanoka([
      { members: group, side: "boat" },
      ...banks,
    ]);
  }

  if (phase === "center") return null;

  if (phase === "arrival") {
    const boatIds = new Set(boatGroup.map((person) => person.id));
    const otherSide =
      context.side === "right" ? "left" : "right";
    const otherBank = allPeople.filter(
      (person) =>
        !boatIds.has(person.id) && person.side === otherSide
    );
    const banks = [
      { members: group, side: context.side },
      { members: otherBank, side: otherSide },
    ];
    const bankDeath = checkBanks(
      banks,
      getHannaTired(allPeople, boatGroup, true)
    );

    if (bankDeath) return bankDeath;

    return checkNanoka(banks);
  }

  return null;
};
