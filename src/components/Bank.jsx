import CharacterButton from "./CharacterButton.jsx";

export default function Bank({
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