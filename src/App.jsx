import { useMemo, useRef, useState } from "react";
import "./App.css";

const CHARACTERS = [
  {
    id: "ema",
    name: "桜羽エマ",
    img: "/images/ema.png",

    condition: (
      <>
        非力なバカ犬なので、一人で船を漕ぐと
        <span className="red-text">溺死</span>
        します。
        <br />

        こちら岸に一人で残すと、
        <span className="red-text">自殺</span>
        します。
        <br />

        惨めですね。
      </>
    ),
  },

  {
    id: "sherry",
    name: "橘シェリー",
    img: "/images/sherry.png",

    condition: (
      <>
        <span className="yellow-text">桜羽エマ</span>
        か
        <span className="yellow-text">遠野ハンナ</span>
        と同席しないと、船を壊してしまいます。
        <br />

        そのまま
        <span className="red-text">溺死</span>
        します。バカです。
      </>
    ),
  },

  {
    id: "hanna",
    name: "遠野ハンナ",
    img: "/images/hanna.png",

    condition: (
      <>
        船の漕ぎ方もロクに分からないので、一人で乗ると
        <span className="red-text">溺死</span>
        します。
        <br />

        <span className="yellow-text">黒部ナノカ</span>
        と2人きりになると、
        <span className="yellow-text">黒部ナノカ</span>
        を海に突き落として
        <span className="red-text">殺害</span>
        します。
        <br />

        血も心もない小娘ですね。
      </>
    ),
  },

  {
    id: "hiro",
    name: "二階堂ヒロ",
    img: "/images/hiro.png",

    condition: (
      <>
        <span className="yellow-text">桜羽エマ</span>
        と2人きりになると、殺人衝動を抑えきれずに
        <span className="yellow-text">桜羽エマ</span>
        を
        <span className="red-text">殺害</span>
        します。
        <br />

        欲望を抑えることもできない、動物以下の存在ですね。
      </>
    ),
  },

  {
    id: "nanoka",
    name: "黒部ナノカ",
    img: "/images/nanoka.png",

    condition: (
      <>
        <span className="yellow-text">橘シェリー</span>
        か
        <span className="yellow-text">二階堂ヒロ</span>
        が同じ場所で監視していないと、どこに居ても
        <span className="yellow-text">桜羽エマ</span>
        を
        <span className="red-text">銃殺</span>
        します。
        <br />

        「計画性がない」と言われたことを、かなり根に持っているようです。
      </>
    ),
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
  const [boatSide, setBoatSide] = useState("left");
  const [boatPosition, setBoatPosition] = useState("left");
  const [isMoving, setIsMoving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [deathReason, setDeathReason] = useState(null);

  const pressTimerRef = useRef(null);
  const longPressedRef = useRef(false);
  const deathRef = useRef(false);

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
        setIsMoving(false);
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
        setIsMoving(false);
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
            onLongPressStart={onLongPressStart}
            onLongPressCancel={onLongPressCancel}
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
      onMouseDown={() => onLongPressStart(person)}
      onMouseUp={onLongPressCancel}
      onMouseLeave={onLongPressCancel}
      onTouchStart={() => onLongPressStart(person)}
      onTouchEnd={onLongPressCancel}
      onTouchCancel={onLongPressCancel}
    >
      <img src={person.img} alt={person.name} />

      {showName && <small>{person.name}</small>}
    </button>
  );
}