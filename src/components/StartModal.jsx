export default function StartModal({
  onStartLevel,
}) {
  return (
    <div className="start-overlay">
      <div className="start-modal">
        <h2>まのさば 船渡りパズル</h2>

        <div className="level-buttons">
          <button onClick={() => onStartLevel(1)}>
            レベル1
          </button>

          <button onClick={() => onStartLevel(2)}>
            レベル2
          </button>

          <button onClick={() => onStartLevel(3)}>
            レベル3
          </button>

          <button onClick={() => onStartLevel(4)}>
            レベル4
          </button>

          <button onClick={() => onStartLevel(5)}>
            レベル5
          </button>
        </div>
      </div>
    </div>
  );
}
