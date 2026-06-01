export default function CharacterModal({
  character,
  onClose,
}) {
  if (!character) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal character-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="character-modal-head">
          <img
            src={character.img}
            alt={character.name}
          />

          <h2>{character.name}</h2>
        </div>

        <p className="condition-text">
          {character.condition}
        </p>

        <button onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}