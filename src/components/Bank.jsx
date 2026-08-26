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
  characterRefs,
  canBoard = () => true,
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
            canMove={
              boatSide === side && canBoard(p)
            }
            onClick={() => onBoard(p)}
            onLongPressStart={onLongPressStart}
            onLongPressCancel={onLongPressCancel}
            buttonRef={(el) => {
              if (characterRefs) {
                characterRefs.current[`${side}-${p.id}`] = el;
              }
            }}
            showName
          />
        ))}
      </div>
    </section>
  );
}
