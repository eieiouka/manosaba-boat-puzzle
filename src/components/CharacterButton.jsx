export default function CharacterButton({
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