export function useDeathEffectStyles({
  gameCardRef,
  characterRefs,
}) {
  const getVisibleCharacterEl = (id) => {
    const candidates = [
      characterRefs.current[`boat-${id}`],
      characterRefs.current[`left-${id}`],
      characterRefs.current[`right-${id}`],
    ];

    return candidates.find((el) => {
      if (!el) return false;
      if (!el.isConnected) return false;

      const rect = el.getBoundingClientRect();

      return rect.width > 0 && rect.height > 0;
    });
  };

  const makeShotStyle = () => {
    const containerEl = gameCardRef.current;
    const nanokaEl = getVisibleCharacterEl("nanoka");
    const emaEl = getVisibleCharacterEl("ema");

    const makeStyle = (
      startX,
      startY,
      endX,
      endY
    ) => {
      const dx = endX - startX;
      const dy = endY - startY;

      const distance = Math.max(
        Math.sqrt(dx * dx + dy * dy),
        1
      );

      const angle =
        (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        "--shot-start-x": `${startX}px`,
        "--shot-start-y": `${startY}px`,
        "--shot-end-x": `${endX}px`,
        "--shot-end-y": `${endY}px`,
        "--shot-dx": `${dx}px`,
        "--shot-dy": `${dy}px`,
        "--shot-angle": `${angle}deg`,
        "--shot-distance": `${distance}px`,
      };
    };

    if (!containerEl) return {};

    const containerRect =
      containerEl.getBoundingClientRect();

    if (!nanokaEl || !emaEl) {
      return makeStyle(
        containerRect.width * 0.35,
        containerRect.height * 0.55,
        containerRect.width * 0.65,
        containerRect.height * 0.55
      );
    }

    const nanokaRect =
      nanokaEl.getBoundingClientRect();

    const emaRect =
      emaEl.getBoundingClientRect();

    const startX =
      nanokaRect.left +
      nanokaRect.width / 2 -
      containerRect.left;

    const startY =
      nanokaRect.top +
      nanokaRect.height / 2 -
      containerRect.top;

    const endX =
      emaRect.left +
      emaRect.width / 2 -
      containerRect.left;

    const endY =
      emaRect.top +
      emaRect.height / 2 -
      containerRect.top;

    return makeStyle(
      startX,
      startY,
      endX,
      endY
    );
  };

  const makeHiroSmashStyle = () => {
    const containerEl = gameCardRef.current;
    const hiroEl = getVisibleCharacterEl("hiro");
    const emaEl = getVisibleCharacterEl("ema");

    if (!containerEl || !hiroEl || !emaEl) {
      return {
        "--smash-start-x": "50%",
        "--smash-start-y": "45%",
        "--smash-end-x": "50%",
        "--smash-end-y": "58%",
      };
    }

    const containerRect =
      containerEl.getBoundingClientRect();

    const hiroRect =
      hiroEl.getBoundingClientRect();

    const emaRect =
      emaEl.getBoundingClientRect();

    const startX =
      hiroRect.left +
      hiroRect.width / 2 -
      containerRect.left;

    const startY =
      hiroRect.top +
      hiroRect.height / 2 -
      containerRect.top;

    const endX =
      emaRect.left +
      emaRect.width / 2 -
      containerRect.left;

    const endY =
      emaRect.top +
      emaRect.height / 2 -
      containerRect.top;

    return {
      "--smash-start-x": `${startX}px`,
      "--smash-start-y": `${startY}px`,
      "--smash-end-x": `${endX}px`,
      "--smash-end-y": `${endY}px`,
    };
  };

  const makeHannaStabStyle = () => {
    const containerEl = gameCardRef.current;
    const hannaEl = getVisibleCharacterEl("hanna");
    const nanokaEl = getVisibleCharacterEl("nanoka");

    if (!containerEl || !hannaEl || !nanokaEl) {
      return {
        "--stab-start-x": "50%",
        "--stab-start-y": "45%",
        "--stab-end-x": "50%",
        "--stab-end-y": "58%",
      };
    }

    const containerRect =
      containerEl.getBoundingClientRect();

    const hannaRect =
      hannaEl.getBoundingClientRect();

    const nanokaRect =
      nanokaEl.getBoundingClientRect();

    const startX =
      hannaRect.left +
      hannaRect.width / 2 -
      containerRect.left;

    const startY =
      hannaRect.top +
      hannaRect.height / 2 -
      containerRect.top;

    const endX =
      nanokaRect.left +
      nanokaRect.width / 2 -
      containerRect.left;

    const endY =
      nanokaRect.top +
      nanokaRect.height / 2 -
      containerRect.top;

    return {
      "--stab-start-x": `${startX}px`,
      "--stab-start-y": `${startY}px`,
      "--stab-end-x": `${endX}px`,
      "--stab-end-y": `${endY}px`,
    };
  };

  const makeHannaDrownStyle = (characterId) => {
    const containerEl = gameCardRef.current;
    const targetEl = getVisibleCharacterEl(characterId);

    if (!containerEl || !targetEl) {
      return {
        "--drown-x": "50%",
        "--drown-y": "58%",
      };
    }

    const containerRect =
      containerEl.getBoundingClientRect();

    const targetRect =
      targetEl.getBoundingClientRect();

    const x =
      targetRect.left +
      targetRect.width / 2 -
      containerRect.left;

    const y =
      targetRect.top +
      targetRect.height / 2 -
      containerRect.top;

    return {
      "--drown-x": `${x}px`,
      "--drown-y": `${y}px`,
    };
  };

  const makeEmaSuicideStyle = () => {
    const containerEl = gameCardRef.current;
    const emaEl = getVisibleCharacterEl("ema");

    if (!containerEl || !emaEl) {
      return {
        "--suicide-x": "50%",
        "--suicide-y": "50%",
      };
    }

    const containerRect =
      containerEl.getBoundingClientRect();

    const emaRect =
      emaEl.getBoundingClientRect();

    const x =
      emaRect.left +
      emaRect.width / 2 -
      containerRect.left;

    const y =
      emaRect.top +
      emaRect.height / 2 -
      containerRect.top;

    return {
      "--suicide-x": `${x}px`,
      "--suicide-y": `${y}px`,
    };
  };

  return {
    makeShotStyle,
    makeHiroSmashStyle,
    makeHannaStabStyle,
    makeHannaDrownStyle,
    makeEmaSuicideStyle,
  };
}