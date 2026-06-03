export default function DeathEffects({
  deathEffect,
  shotStyle,
  smashStyle,
  stabStyle,
  slashStyle,
  drownStyle,
  suicideStyle,
}) {
  return (
    <>
      {deathEffect === "nanoka-shot" && (
        <div
          className="nanoka-shot-effect"
          style={shotStyle}
        >
          <div className="nanoka-muzzle-flash" />
          <div className="nanoka-bullet-trail" />
          <div className="nanoka-bullet" />
          <div className="nanoka-hit-flash" />
        </div>
      )}

      {deathEffect === "hiro-smash" && (
        <div
          className="hiro-smash-effect"
          style={smashStyle}
        >
          <div className="hiro-smash-weapon" />
          <div className="hiro-smash-impact" />
          <div className="hiro-smash-flash" />
        </div>
      )}

      {deathEffect === "hanna-stab" && (
        <div
          className="hanna-stab-effect"
          style={stabStyle}
        >
          <div className="hanna-stab-knife" />
          <div className="hanna-stab-impact" />
          <div className="hanna-stab-flash" />
        </div>
      )}

      {deathEffect === "honoka-slash" && (
        <div
          className="honoka-slash-effect"
          style={slashStyle}
        >
          <div className="honoka-scythe" />

          <div className="honoka-slash-impact" />

          <div className="honoka-slash-flash" />
        </div>
      )}

      {deathEffect === "character-drown" && (
        <div
          className="hanna-drown-effect"
          style={drownStyle}
        >
          <div className="hanna-water-ring hanna-ring-1" />
          <div className="hanna-water-ring hanna-ring-2" />
          <div className="hanna-water-ring hanna-ring-3" />
          <div className="hanna-water-splash hanna-splash-1" />
          <div className="hanna-water-splash hanna-splash-2" />
          <div className="hanna-water-splash hanna-splash-3" />
          <div className="hanna-drown-shadow" />
        </div>
      )}

      {deathEffect === "ema-suicide" && (
        <div
          className="ema-suicide-effect"
          style={suicideStyle}
        >
          <div className="ema-suicide-flash" />
          <div className="ema-suicide-ring" />
          <div className="ema-suicide-blade" />
        </div>
      )}
    </>
  );
}