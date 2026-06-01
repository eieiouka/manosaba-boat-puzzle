export default function RulesModal({
  onClose,
}) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>ルール説明</h2>

        <p>
          船には
          <span className="green-text">
            最大2人まで
          </span>
          乗れます。
        </p>

        <p>
          誰も乗っていない状態では、船は動きません。
        </p>

        <p>
          キャラクターごとに、
          <span className="red-text">
            死亡・殺害条件
          </span>
          があります。
          <br />
          （
          <span className="green-text">
            キャラ長押し
          </span>
          で見ることができます）
        </p>

        <p>
          誰も死なないように、魔法少女たちを向こう岸まで運んであげましょう。
        </p>

        <button onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}