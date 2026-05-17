import { useMemo, useRef, useState } from "react";
import "./App.css";

const CHARACTERS = [
  {
    id: "ema",
    name: "桜羽エマ",
    img: "/images/ema.png",
    condition: "非力なバカ犬なので、一人で船を漕ぐと溺れます。\nこちら岸に一人で残すと、自殺します。\n惨めですね。",
  },
  {
    id: "sherry",
    name: "橘シェリー",
    img: "/images/sherry.png",
    condition: "死亡・殺害条件は後で設定します。",
  },
  {
    id: "hanna",
    name: "遠野ハンナ",
    img: "/images/hanna.png",
    condition: "死亡・殺害条件は後で設定します。",
  },
  {
    id: "hiro",
    name: "二階堂ヒロ",
    img: "/images/hiro.png",
    condition: "死亡・殺害条件は後で設定します。",
  },
  {
    id: "nanoka",
    name: "黒部ナノカ",
    img: "/images/nanoka.png",
    condition: "死亡・殺害条件は後で設定します。",
  },
];

const INITIAL_PEOPLE = CHARACTERS.map((c) => ({
  ...c,
  side: "left",
}));

const BOAT_TIME = 700;
const LONG_PRESS_TIME = 550;

export default function App() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);

  const [boat, setBoat] = useState([]);

  const [boatSide, setBoatSide] =
    useState("left");

  const [boatPosition, setBoatPosition] =
    useState("left");

  const [isMoving, setIsMoving] =
    useState(false);

  const [moves, setMoves] = useState(0);

  const [showRules, setShowRules] =
    useState(false);

  const [selectedCharacter, setSelectedCharacter] =
    useState(null);

  const pressTimerRef = useRef(null);

  const longPressedRef = useRef(false);

  const clear = useMemo(
    () =>
      people.every((p) => p.side === "right") &&
      boat.length === 0,
    [people, boat]
  );

  const peopleOnSide = (side) =>
    people.filter((p) => p.side === side);

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
    if (isMoving) return;

    if (longPressedRef.current) return;

    if (person.side !== boatSide) return;

    if (boat.length >= 2) return;

    setPeople((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setBoat((prev) => [...prev, person]);
  };

  const leaveBoat = (person) => {
    if (isMoving) return;

    if (longPressedRef.current) return;

    setBoat((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setPeople((prev) => [
      { ...person, side: boatSide },
      ...prev,
    ]);
  };

  const checkDeathAtCenter = () => {
    // 後で死亡条件を書く
    return false;
  };

  const moveBoat = () => {
    if (isMoving) return;

    if (boat.length === 0) return;

    const nextSide =
      boatSide === "left" ? "right" : "left";

    setIsMoving(true);

    setBoatPosition(nextSide);

    setTimeout(() => {
      const isDead = checkDeathAtCenter();

      if (isDead) {
        setIsMoving(false);
        return;
      }
    }, BOAT_TIME / 2);

    setTimeout(() => {
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
  };

  return (
    <main className="app">
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
                    onClick={() => leaveBoat(p)}
                    onLongPressStart={
                      startLongPress
                    }
                    onLongPressCancel={
                      cancelLongPress
                    }
                  />
                ))}
              </div>

              <button
                className="move-button"
                onClick={moveBoat}
                disabled={
                  isMoving || boat.length === 0
                }
              >
                {isMoving
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
          />
        </div>

        {clear && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>クリア！</h2>

              <p>
                {moves}
                手で全員を向こう岸へ
                運びました。
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
                船には最大2人まで乗れます。
              </p>

              <p>
                誰も乗っていない状態では、
                船は動きません。
              </p>

              <p>
                キャラクターごとに、
                死亡・殺害条件があります。
                <br />
                （キャラ長押しで
                見ることができます）
              </p>

              <p>
                誰も死なないように、
                魔法少女たちを
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
                  alt={
                    selectedCharacter.name
                  }
                />

                <h2>
                  {selectedCharacter.name}
                </h2>
              </div>

              <p className="condition-text">
                {selectedCharacter.condition
                  .split("\n")
                  .map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
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

function Bank({
  title,
  side,
  people,
  boatSide,
  isMoving,
  onBoard,
  onLongPressStart,
  onLongPressCancel,
}) {
  return (
    <section className="bank">
      <h2>{title}</h2>

      <div className="people-list">
        {people.map((p) => (
          <CharacterButton
            key={p.id}
            person={p}
            className="person"
            disabled={isMoving}
            canMove={boatSide === side}
            onClick={() => onBoard(p)}
            onLongPressStart={
              onLongPressStart
            }
            onLongPressCancel={
              onLongPressCancel
            }
            showName
          />
        ))}
      </div>
    </section>
  );
}

function CharacterButton({
  person,
  className,
  disabled,
  canMove = true,
  onClick,
  onLongPressStart,
  onLongPressCancel,
  showName = false,
}) {
  const handleClick = () => {
    if (!canMove) return;

    onClick();
  };

  return (
    <button
      className={`${className} ${
        !canMove ? "cannot-move" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
      onMouseDown={() =>
        onLongPressStart(person)
      }
      onMouseUp={onLongPressCancel}
      onMouseLeave={onLongPressCancel}
      onTouchStart={() =>
        onLongPressStart(person)
      }
      onTouchEnd={onLongPressCancel}
      onTouchCancel={onLongPressCancel}
    >
      <img
        src={person.img}
        alt={person.name}
      />

      {showName && (
        <small>{person.name}</small>
      )}
    </button>
  );
}