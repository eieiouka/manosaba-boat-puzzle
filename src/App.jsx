import { useMemo, useState } from "react";
import "./App.css";

const CHARACTERS = [
  { id: "ema", name: "エマ", img: "/images/ema.png" },
  { id: "sherry", name: "シェリー", img: "/images/sherry.png" },
  { id: "hanna", name: "ハンナ", img: "/images/hanna.png" },
  { id: "hiro", name: "ヒロ", img: "/images/hiro.png" },
  { id: "nanoka", name: "ナノカ", img: "/images/nanoka.png" },
];

const INITIAL_PEOPLE = CHARACTERS.map((c) => ({
  ...c,
  side: "left",
}));

const BOAT_TIME = 700;

export default function App() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [boat, setBoat] = useState([]);
  const [boatSide, setBoatSide] = useState("left");
  const [boatPosition, setBoatPosition] = useState("left");
  const [isMoving, setIsMoving] = useState(false);
  const [moves, setMoves] = useState(0);

  const [showRules, setShowRules] = useState(false);

  const clear = useMemo(
    () => people.every((p) => p.side === "right") && boat.length === 0,
    [people, boat]
  );

  const peopleOnSide = (side) =>
    people.filter((p) => p.side === side);

  const boardPerson = (person) => {
    if (isMoving) return;
    if (person.side !== boatSide) return;
    if (boat.length >= 2) return;

    setPeople((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setBoat((prev) => [...prev, person]);
  };

  const leaveBoat = (person) => {
    if (isMoving) return;

    setBoat((prev) =>
      prev.filter((p) => p.id !== person.id)
    );

    setPeople((prev) => [
      ...prev,
      { ...person, side: boatSide },
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

    // 一気に反対側へ移動
    setBoatPosition(nextSide);

    // 中央通過タイミングで死亡判定
    setTimeout(() => {
      const isDead = checkDeathAtCenter();

      if (isDead) {
        setIsMoving(false);
        return;
      }
    }, BOAT_TIME / 2);

    // 到着処理
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
          />

          <div className="river">
            <div
              className={`boat boat-${boatPosition}`}
            >
              <div className="boat-people">
                {boat.map((p) => (
                  <button
                    key={p.id}
                    className="person in-boat"
                    onClick={() => leaveBoat(p)}
                    disabled={isMoving}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                    />
                  </button>
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
          />
        </div>

        {clear && (
          <div className="clear">
            <h2>クリア！</h2>

            <p>
              {moves}
              手で全員を向こう岸へ運びました。
            </p>

            <button onClick={resetGame}>
              もう一度
            </button>
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
                特定条件を満たすと、
                川の中央で死亡判定が
                発生します。
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
}) {
  return (
    <section className="bank">
      <h2>{title}</h2>

      <div className="people-list">
        {people.map((p) => (
          <button
            key={p.id}
            className="person"
            onClick={() => onBoard(p)}
            disabled={
              isMoving || boatSide !== side
            }
          >
            <img
              src={p.img}
              alt={p.name}
            />

            <small>{p.name}</small>
          </button>
        ))}
      </div>
    </section>
  );
}