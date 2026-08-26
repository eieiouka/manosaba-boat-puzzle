export default function CharacterButton({
  person,
  className,
  disabled,
  canMove = true,
  onClick,
  onLongPressStart,
  onLongPressCancel,
  showName = false,
  buttonRef,
}) {
  const displayedImage =
    person.sulking && person.sulkingImg
      ? person.sulkingImg
      : person.img;

  const handleClick = () => {
    if (!canMove) return;

    onClick();
  };

  return (
    <button
      ref={buttonRef}
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
      <img src={displayedImage} alt={person.name} />

      {showName && <small>{person.name}</small>}
    </button>
  );
}
