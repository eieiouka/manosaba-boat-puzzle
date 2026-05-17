import { useMemo, useRef, useState } from "react";
import "./App.css";
import { CHARACTERS } from "./data/characters.jsx";
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
  const [started, setStarted] = useState(false);

  const pressTimerRef = useRef(null);
  const longPressedRef = useRef(false);
  const deathRef = useRef(false);

  const { playBgm } = useBgm("/bgm/BGM_puzzle.mp3", 0.3);
  const { playVoice } = useVoice(1);

  const clear = useMemo(
    () =>
      !deathReason &&
      people.every((p) => p.side === "right") &&
      boat.length === 0,
    [people, boat, deathReason]
  );

  const peopleOnSide = (side) =>
    people.filter((p) => p.side === side);

  const has = (group, id) =>
    group.some((p) => p.id === id);

  const onlyPair = (group, a, b) =>
    group.length === 2 && has(group, a) && has(group, b);

  const getDeathReason = (group, phase, context = {}) => {
    const allPeople = context.allPeople || [...people, ...boat];

    if (phase === "center" && context.place === "boat") {
      if (group.length === 1 && has(group, "ema")) {
        return {
          title: "エマ死亡",
          message: "エマが一人で船を漕ごうとして、溺死しました。",
        };
      }

      if (group.length === 1 && has(group, "hanna")) {
        return {
          title: "ハンナ死亡",
          message: "ハンナが一人で船を漕ごうとして、溺死しました。",
        };
      }

      if (
        has(group, "sherry") &&
        !has(group, "ema") &&
        !has(group, "hanna")
      ) {
        return {
          title: "シェリー死亡",
          message:
            "シェリーがエマかハンナと同席していないため、船を壊して溺死しました。",
        };
      }
    }

    if (onlyPair(group, "hiro", "ema")) {
      return {
        title: "エマ死亡",
        message:
          "ヒロとエマが2人きりになり、ヒロがエマを殺害しました。",
      };
    }

    if (onlyPair(group, "hanna", "nanoka")) {
      return {
        title: "ナノカ死亡",
        message:
          "ハンナとナノカが2人きりになり、ハンナがナノカを海に突き落としました。",
      };
    }

    if (
      context.side === "left" &&
      group.length === 1 &&
      has(group, "ema")
    ) {
      return {
        title: "エマ死亡",
        message:
          "こちら岸にエマが一人きりで残され、自殺しました。",
      };
    }

    if (
      has(group, "nanoka") &&
      !has(group, "sherry") &&
      !has(group, "hiro") &&
      has(allPeople, "ema")
    ) {
      return {
        title: "エマ死亡",
        message:
          "ナノカのいる場所にシェリーもヒロもいなかったため、ナノカがエマを銃殺しました。",
      };
    }

    return null;
  };

  const startGame = async () => {
    setStarted(true);

    try {
      await playBgm();
    } catch (e) {
      console.error("BGMの再生に失敗しました", e);
    }
  };

  const playBoardVoice = (person) => {
    const voiceNumber =
      Math.floor(Math.random() * BOARD_VOICE_COUNT) + 1;

    playVoice(`/voices/${person.id}/board_${voiceNumber}.mp3`);
  };

  const startLongPress = (person) => {
    if (isMoving) return;

    longPressedRef.current = false;

    pressTimerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      setSelectedCharacter(person);
    }, LONG_PRESS_TIME);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const boardPerson = (person) => {
    if (isMoving || deathReason) return;
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
    if (isMoving || deathReason) return;
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
    if (isMoving || deathReason) return;
    if (boat.length === 0) return;

    const departureSide = boatSide;
    const nextSide = boatSide === "left" ? "right" : "left";
    const allPeople = [...people, ...boat];

    deathRef.current = false;

    setIsMoving(true);

    setBoatPosition("center");

    setTimeout(() => {
      const boatGroup = [...boat];

      const departureGroup = people.filter(
        (p) => p.side === departureSide
      );

      const boatDeath = getDeathReason(boatGroup, "center", {
        place: "boat",
        side: "boat",
        departureSide,
        nextSide,
        allPeople,
      });

      if (boatDeath) {
        deathRef.current = true;
        setDeathReason(boatDeath);
        return;
      }

      const departureDeath = getDeathReason(
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
        deathRef.current = true;
        setDeathReason(departureDeath);
        return;
      }

      setBoatPosition(nextSide);
    }, BOAT_TIME / 2);

    setTimeout(() => {
      if (deathRef.current) return;

      const arrivalGroup = [
        ...people.filter((p) => p.side === nextSide),
        ...boat,
      ];

      const death = getDeathReason(arrivalGroup, "arrival", {
        place: "arrival",
        side: nextSide,
        departureSide,
        nextSide,
        allPeople,
      });

      if (death) {
        deathRef.current = true;
        setBoatSide(nextSide);
        setDeathReason(death);
        setIsMoving(false);
        return;
      }

      setBoatSide(nextSide);
      setMoves((m) => m + 1);
      setIsMoving(false);
    }, BOAT_TIME);
  };

  const resetGame = () => {
    setPeople(INITIAL_PEOPLE);
    setBoat([]);
    setBoatSide("left");
    setBoatPosition("left");
    setIsMoving(false);
    setMoves(0);
    setSelectedCharacter(null);
    setShowRules(false);
    setDeathReason(null);
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

      <section className="game-card">
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
          />

          <div className="river">
            <div className={`boat boat-${boatPosition}`}>
              <div className="boat-people">
                {boat.map((p) => (
                  <CharacterButton
                    key={p.id}
                    person={p}
                    className="person in-boat"
                    disabled={isMoving}
                    canMove
                    onClick={() => leaveBoat(p)}
                    onLongPressStart={startLongPress}
                    onLongPressCancel={cancelLongPress}
                  />
                ))}
              </div>

              <button
                className="move-button"
                onClick={moveBoat}
                disabled={isMoving || boat.length === 0 || deathReason}
              >
                {isMoving || deathReason ? "移動中..." : "出航"}
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
          />
        </div>

        {deathReason && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>{deathReason.title}</h2>

              <p>{deathReason.message}</p>

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
            onClick={() => setShowRules(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>ルール説明</h2>

              <p>
                船には
                <span className="green-text">最大2人まで</span>
                乗れます。
              </p>

              <p>
                誰も乗っていない状態では、船は動きません。
              </p>

              <p>
                キャラクターごとに、
                <span className="red-text">死亡・殺害条件</span>
                があります。
                <br />
                （
                <span className="green-text">キャラ長押し</span>
                で見ることができます）
              </p>

              <p>
                誰も死なないように、魔法少女たちを向こう岸まで運んであげましょう。
              </p>

              <button onClick={() => setShowRules(false)}>
                閉じる
              </button>
            </div>
          </div>
        )}

        {selectedCharacter && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedCharacter(null)}
          >
            <div
              className="modal character-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="character-modal-head">
                <img
                  src={selectedCharacter.img}
                  alt={selectedCharacter.name}
                />

                <h2>{selectedCharacter.name}</h2>
              </div>

              <p className="condition-text">
                {selectedCharacter.condition}
              </p>

              <button onClick={() => setSelectedCharacter(null)}>
                閉じる
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}