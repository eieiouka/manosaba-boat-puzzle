export const CHARACTERS = [
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

        哀れな小娘ですね。
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
        します。バカな怪力女です。
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
        を包丁で
        <span className="red-text">刺殺</span>
        します。
        <br />

        本人は、「ナノカさんが銃を持っていたのが原因。これは正当防衛」と主張しています。
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
        <span className="red-text">撲殺</span>
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

  {
    id: "honoka",
    name: "黒部ホノカ",
    img: "/images/honoka.png",

    condition: (
      <>
        誰かと一緒に船へ乗ると、同乗者を鎌で
        <span className="red-text">斬殺</span>
        します。
        <br />

        <span className="yellow-text">橘シェリー</span>
        と2人きりになると、
        <span className="yellow-text">橘シェリー</span>
        を
        <span className="red-text">斬殺</span>
        します。
        <br />

        うるさいのが気に入らないようです。
      </>
    ),
  },
];