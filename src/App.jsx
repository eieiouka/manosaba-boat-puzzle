import { useMemo, useRef, useState } from "react";
import "./App.css";

import { CHARACTERS } from "./data/characters.jsx";
import { getDeathReason } from "./data/deathRules.jsx";

import { useBgm } from "./hooks/useBgm.js";
import { useVoice } from "./hooks/useVoice.js";

import Bank from "./components/Bank.jsx";
import CharacterButton from "./components/CharacterButton.jsx";

const INITIAL_PEOPLE = CHARACTERS.map((c) => ({
  ...c,
  side: "left",
}));

const BOAT_TIME = 700;
const LONG_PRESS_TIME = 550;
const BOARD_VOICE_COUNT = 3;
const DEATH_LOG_DELAY = 1000;

const CHARACTER_VOICE_VOLUME = {
  ema: 4,
  sherry: 2.1,
  hanna: 2.1,
  hiro: 3.7,
  nanoka: 3.5,
};

export default function App() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [boat, setBoat] = useState([]);
  const [boatSide, setBoatSide] = useState("left");
  const [boatPosition, setBoatPosition] = useState("left");
  const [isMoving, setIsMoving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [deathReason, setDeathReason] = useState(null);
  const [deathEffect, setDeathEffect] = useState(null);
  const [shotStyle, setShotStyle] = useState({});
  const [started, setStarted] = useState(false);

  const pressTimerRef = useRef(null);
  const longPressedRef = useRef(false);
  const deathRef = useRef(false);
  const deathLogTimerRef = useRef(null);

  const gameCardRef = useRef(null);

  const characterRefs = useRef({});

  const { playBgm } = useBgm(
    "/bgm/BGM_puzzle.mp3",
    0.22
  );

  const { playVoice, unlockVoice } =
    useVoice(0.55);

  const clear = useMemo(
    () =>
      !deathReason &&
      !deathEffect &&
      people.every((p) => p.side === "right") &&
      boat.length === 0,
    [people, boat, deathReason, deathEffect]
  );

  const peopleOnSide = (side) =>
    people.filter((p) => p.side === side);

  const makeNanokaShotStyle = () => {
    const containerEl = gameCardRef.current;

    const getVisibleCharacterEl = (id) => {
      const candidates = [
        characterRefs.current[`boat-${id}`],
        characterRefs.current[`left-${id}`],
        characterRefs.current[`right-${id}`],
      ];

      return candidates.find((el) => {
        if (!el) return false;

        if (!el.isConnected) return false;

        const rect = el.getBoundingClientRect();

        return (
          rect.width > 0 &&
          rect.height > 0
        );
      });
    };

    const nanokaEl =
      getVisibleCharacterEl("nanoka");

    const emaEl =
      getVisibleCharacterEl("ema");

    const makeStyle = (
      startX,
      startY,
      endX,
      endY
    ) => {
      const dx = endX - startX;
      const dy = endY - startY;

      const distance = Math.max(
        Math.sqrt(dx * dx + dy * dy),
        1
      );

      const angle =
        (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        "--shot-start-x": `${startX}px`,
        "--shot-start-y": `${startY}px`,
        "--shot-end-x": `${endX}px`,
        "--shot-end-y": `${endY}px`,
        "--shot-dx": `${dx}px`,
        "--shot-dy": `${dy}px`,
        "--shot-angle": `${angle}deg`,
        "--shot-distance": `${distance}px`,
      };
    };

    if (!containerEl) {
      return {};
    }

    const containerRect =
      containerEl.getBoundingClientRect();

    if (!nanokaEl || !emaEl) {
      return makeStyle(
        containerRect.width * 0.35,
        containerRect.height * 0.55,
        containerRect.width * 0.65,
        containerRect.height * 0.55
      );
    }

    const nanokaRect =
      nanokaEl.getBoundingClientRect();

    const emaRect =
      emaEl.getBoundingClientRect();

    const startX =
      nanokaRect.left +
      nanokaRect.width / 2 -
      containerRect.left;

    const startY =
      nanokaRect.top +
      nanokaRect.height / 2 -
      containerRect.top;

    const endX =
      emaRect.left +
      emaRect.width / 2 -
      containerRect.left;

    const endY =
      emaRect.top +
      emaRect.height / 2 -
      containerRect.top;

    return makeStyle(
      startX,
      startY,
      endX,
      endY
    );
  };

  const showDeathLogLater = (death) => {
    if (deathLogTimerRef.current) {
      clearTimeout(deathLogTimerRef.current);

      deathLogTimerRef.current = null;
    }

    deathLogTimerRef.current = setTimeout(
      () => {
        setDeathReason(death);

        deathLogTimerRef.current = null;
      },
      death.delay ?? DEATH_LOG_DELAY
    );
  };

  const playDeathVoice = (death) => {
    if (!death.badVoice) return;

    playVoice(
      death.badVoice,
      death.badVoiceVolume ?? 2.2
    );
  };

  const applyDeath = (death) => {
    deathRef.current = true;

    setIsMoving(false);

    if (death.effect) {
      if (death.effect === "nanoka-shot") {
        setShotStyle(
          makeNanokaShotStyle()
        );
      }

      setDeathEffect(death.effect);
    }

    playDeathVoice(death);

    showDeathLogLater(death);
  };

  const startGame = async () => {
    setStarted(true);

    try {
      await playBgm();

      await unlockVoice();
    } catch (e) {
      console.error(
        "音声の初期化に失敗しました",
        e
      );
    }
  };

  const playBoardVoice = (person) => {
    const voiceNumber =
      Math.floor(
        Math.random() * BOARD_VOICE_COUNT
      ) + 1;

    playVoice(
      `/voices/${person.id}/board_${voiceNumber}.mp3`,
      CHARACTER_VOICE_VOLUME[person.id] ?? 1
    );
  };

  const startLongPress = (person) => {
    if (isMoving) return;

    longPressedRef.current = false;

    pressTimerRef.current = setTimeout(
      () => {
        longPressedRef.current = true;

        setSelectedCharacter(person);
      },
      LONG_PRESS_TIME
    );
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);

      pressTimerRef.current = null;
    }
  };

  const boardPerson = (person) => {
    if (
      isMoving ||
      deathReason ||
      deathEffect
    )
      return;

    if (longPressedRef.current) return;

    if (person.side !== boatSide) return;

    if (boat.length >= 2) return;

    setPeople((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setBoat((prev) => [...prev, person]);

    playBoardVoice(person);
  };

  const leaveBoat = (person) => {
    if (
      isMoving ||
      deathReason ||
      deathEffect
    )
      return;

    if (longPressedRef.current) return;

    setBoat((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setPeople((prev) => [
      { ...person, side: boatSide },
      ...prev,
    ]);
  };

  const moveBoat = () => {
    if (
      isMoving ||
      deathReason ||
      deathEffect
    )
      return;

    if (boat.length === 0) return;

    const departureSide = boatSide;

    const nextSide =
      boatSide === "left"
        ? "right"
        : "left";

    const allPeople = [...people, ...boat];

    deathRef.current = false;

    setIsMoving(true);

    setBoatPosition("center");

    setTimeout(() => {
      const boatGroup = [...boat];

      const departureGroup = people.filter(
        (p) => p.side === departureSide
      );

      const boatDeath = getDeathReason(
        boatGroup,
        "center",
        {
          place: "boat",
          side: "boat",
          departureSide,
          nextSide,
          allPeople,
        }
      );

      if (boatDeath) {
        applyDeath(boatDeath);

        return;
      }

      const departureDeath =
        getDeathReason(
          departureGroup,
          "center",
          {
            place: "departure",
            side: departureSide,
            departureSide,
            nextSide,
            allPeople,
          }
        );

      if (departureDeath) {
        applyDeath(departureDeath);

        return;
      }

      setBoatPosition(nextSide);
    }, BOAT_TIME / 2);

    setTimeout(() => {
      if (deathRef.current) return;

      const arrivalGroup = [
        ...people.filter(
          (p) => p.side === nextSide
        ),
        ...boat,
      ];

      const death = getDeathReason(
        arrivalGroup,
        "arrival",
        {
          place: "arrival",
          side: nextSide,
          departureSide,
          nextSide,
          allPeople,
        }
      );

      if (death) {
        setBoatSide(nextSide);

        applyDeath(death);

        return;
      }

      setBoatSide(nextSide);

      setMoves((m) => m + 1);

      setIsMoving(false);
    }, BOAT_TIME);
  };

  const resetGame = () => {
    if (deathLogTimerRef.current) {
      clearTimeout(deathLogTimerRef.current);

      deathLogTimerRef.current = null;
    }

    setPeople(INITIAL_PEOPLE);

    setBoat([]);

    setBoatSide("left");

    setBoatPosition("left");

    setIsMoving(false);

    setMoves(0);

    setSelectedCharacter(null);

    setShowRules(false);

    setDeathReason(null);

    setDeathEffect(null);

    setShotStyle({});

    deathRef.current = false;
  };

  return (
    <main className="app">
      {!started && (
        <div className="start-overlay">
          <div className="start-modal">
            <h2>まのさば 船渡りパズル</h2>

            <button onClick={startGame}>
              Game Start
            </button>
          </div>
        </div>
      )}

      <section
        ref={gameCardRef}
        className={`game-card ${
          deathEffect === "boat-break"
            ? "death-shake"
            : ""
        }`}
      >
        {deathEffect === "nanoka-shot" && (
          <div
            className="nanoka-shot-effect"
            style={shotStyle}
          >
            <div className="nanoka-muzzle-flash" />

            <div className="nanoka-bullet-trail" />

            <div className="nanoka-bullet" />

            <div className="nanoka-hit-flash" />
          </div>
        )}

        <header className="header">
          <h1>まのさば 船渡りパズル</h1>

          <button
            className="rule-button"
            onClick={() => setShowRules(true)}
          >
            ルール説明
          </button>
        </header>

        <div className="status">
          <span>手数：{moves}</span>

          <button
            onClick={resetGame}
            disabled={isMoving}
          >
            リセット
          </button>
        </div>

        <div className="river-area">
          <Bank
            title="こちら岸"
            side="left"
            people={peopleOnSide("left")}
            boatSide={boatSide}
            isMoving={isMoving}
            onBoard={boardPerson}
            onLongPressStart={startLongPress}
            onLongPressCancel={cancelLongPress}
            characterRefs={characterRefs}
          />

          <div className="river">
            {deathEffect === "boat-break" && (
              <div className="boat-break-effect">
                <div className="break-flash" />

                <div className="wood-piece piece-1" />

                <div className="wood-piece piece-2" />

                <div className="wood-piece piece-3" />

                <div className="water-splash splash-1" />

                <div className="water-splash splash-2" />

                <div className="water-splash splash-3" />
              </div>
            )}

            <div
              className={`boat boat-${boatPosition}`}
            >
              <div className="boat-people">
                {boat.map((p) => (
                  <CharacterButton
                    key={p.id}
                    person={p}
                    className="person in-boat"
                    disabled={isMoving}
                    canMove
                    onClick={() =>
                      leaveBoat(p)
                    }
                    onLongPressStart={
                      startLongPress
                    }
                    onLongPressCancel={
                      cancelLongPress
                    }
                    buttonRef={(el) => {
                      characterRefs.current[
                        `boat-${p.id}`
                      ] = el;
                    }}
                  />
                ))}
              </div>

              <button
                className="move-button"
                onClick={moveBoat}
                disabled={
                  isMoving ||
                  boat.length === 0 ||
                  deathReason ||
                  deathEffect
                }
              >
                {isMoving ||
                deathReason ||
                deathEffect
                  ? "移動中..."
                  : "出航"}
              </button>
            </div>
          </div>

          <Bank
            title="向こう岸"
            side="right"
            people={peopleOnSide("right")}
            boatSide={boatSide}
            isMoving={isMoving}
            onBoard={boardPerson}
            onLongPressStart={startLongPress}
            onLongPressCancel={cancelLongPress}
            characterRefs={characterRefs}
          />
        </div>

        {deathReason && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>{deathReason.title}</h2>

              <p className="condition-text">
                {deathReason.message}
              </p>

              <button onClick={resetGame}>
                最初からやり直す
              </button>
            </div>
          </div>
        )}

        {clear && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>クリア！</h2>

              <p>
                {moves}
                手で全員を向こう岸へ運びました。
              </p>

              <button onClick={resetGame}>
                もう一度
              </button>
            </div>
          </div>
        )}

        {showRules && (
          <div
            className="modal-backdrop"
            onClick={() =>
              setShowRules(false)
            }
          >
            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <h2>ルール説明</h2>

              <p>
                船には
                <span className="green-text">
                  最大2人まで
                </span>
                乗れます。
              </p>

              <p>
                誰も乗っていない状態では、
                船は動きません。
              </p>

              <p>
                キャラクターごとに、
                <span className="red-text">
                  死亡・殺害条件
                </span>
                があります。
                <br />
                （
                <span className="green-text">
                  キャラ長押し
                </span>
                で見ることができます）
              </p>

              <p>
                誰も死なないように、
                魔法少女たちを向こう岸まで
                運んであげましょう。
              </p>

              <button
                onClick={() =>
                  setShowRules(false)
                }
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {selectedCharacter && (
          <div
            className="modal-backdrop"
            onClick={() =>
              setSelectedCharacter(null)
            }
          >
            <div
              className="modal character-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="character-modal-head">
                <img
                  src={selectedCharacter.img}
                  alt={selectedCharacter.name}
                />

                <h2>
                  {selectedCharacter.name}
                </h2>
              </div>

              <p className="condition-text">
                {selectedCharacter.condition}
              </p>

              <button
                onClick={() =>
                  setSelectedCharacter(null)
                }
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}