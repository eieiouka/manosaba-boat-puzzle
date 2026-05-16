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

  const clear = useMemo(
    () => people.every((p) => p.side === "right") && boat.length === 0,
    [people, boat]
  );

  const peopleOnSide = (side) => people.filter((p) => p.side === side);

  const boardPerson = (person) => {
    if (isMoving) return;
    if (person.side !== boatSide) return;
    if (boat.length >= 2) return;

    setPeople((prev) => prev.filter((p) => p.id !== person.id));
    setBoat((prev) => [...prev, person]);
  };

  const leaveBoat = (person) => {
    if (isMoving) return;

    setBoat((prev) => prev.filter((p) => p.id !== person.id));
    setPeople((prev) => [...prev, { ...person, side: boatSide }]);
  };

  const checkDeathAtCenter = () => {
    // 後で死亡条件をここに書く
    // true を返すと死亡扱いにできる
    return false;
  };

  const moveBoat = () => {
    if (isMoving) return;
    if (boat.length === 0) return;

    const nextSide = boatSide === "left" ? "right" : "left";

    setIsMoving(true);

    // 一気に反対側へ移動
    setBoatPosition(nextSide);

    // 中央通過タイミングで死亡判定
    setTimeout(() => {
      const isDead = checkDeathAtCenter();

      if (isDead) {
        // 後で死亡演出を追加
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
          <p className="eyebrow">Manosaba Boat Puzzle</p>

          <h1>船で向こう岸まで連れていこう</h1>

          <p className="rule">
            船には最大2人まで。死亡判定は中央通過時に行われます。
          </p>
        </header>

        <div className="status">
          <span>手数：{moves}</span>

          <button onClick={resetGame} disabled={isMoving}>
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
            <div className={`boat boat-${boatPosition}`}>
              <div className="boat-people">
                {boat.map((p) => (
                  <button
                    key={p.id}
                    className="person in-boat"
                    onClick={() => leaveBoat(p)}
                    disabled={isMoving}
                  >
                    <img src={p.img} alt={p.name} />
                  </button>
                ))}
              </div>

              <button
                className="move-button"
                onClick={moveBoat}
                disabled={isMoving || boat.length === 0}
              >
                {isMoving ? "移動中..." : "出航"}
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

            <p>{moves}手で全員を向こう岸へ運びました。</p>

            <button onClick={resetGame}>もう一度</button>
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
            disabled={isMoving || boatSide !== side}
          >
            <img src={p.img} alt={p.name} />

            <small>{p.name}</small>
          </button>
        ))}
      </div>
    </section>
  );
}