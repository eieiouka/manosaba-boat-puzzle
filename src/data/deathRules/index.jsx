import { getDeathReasonLevel1 } from "./level1.jsx";
import { getDeathReasonLevel2 } from "./level2.jsx";
import { getDeathReasonLevel3 } from "./level3.jsx";
import { getDeathReasonLevel4 } from "./level4.jsx";

export const getDeathReason = (
  group,
  phase,
  context = {}
) => {
  const levelId = Number(context.levelId ?? 1);

  if (levelId === 4 || levelId === 5) {
    return getDeathReasonLevel4(
      group,
      phase,
      context
    );
  }

  if (levelId === 3) {
    return getDeathReasonLevel3(
      group,
      phase,
      context
    );
  }

  if (levelId === 2) {
    return getDeathReasonLevel2(
      group,
      phase,
      context
    );
  }

  return getDeathReasonLevel1(
    group,
    phase,
    context
  );
};
