export default function ClearModal({
  moves,
  onStartLevel,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>クリア！</h2>

        <p>
          {moves}
          手で全員を向こう岸へ運びました。
        </p>

        <div className="level-buttons">
          <button onClick={() => onStartLevel(1)}>
            レベル1
          </button>

          <button onClick={() => onStartLevel(2)}>
            レベル2
          </button>
        </div>
      </div>
    </div>
  );
}