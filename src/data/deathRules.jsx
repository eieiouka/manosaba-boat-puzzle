import { getDeathReasonLevel1 } from "./deathRules/level1.jsx";
import { getDeathReasonLevel2 } from "./deathRules/level2.jsx";
import { getDeathReasonLevel3 } from "./deathRules/level3.jsx";
import { getDeathReasonLevel4 } from "./deathRules/level4.jsx";
import { getDeathReasonLevel5 } from "./deathRules/level5.jsx";

export function getDeathReason(
  group,
  phase,
  context = {}
) {
  const levelId = Number(context.levelId ?? 1);

  if (levelId === 1) {
    return getDeathReasonLevel1(group, phase, context);
  }

  if (levelId === 2) {
    return getDeathReasonLevel2(group, phase, context);
  }

  if (levelId === 3) {
    return getDeathReasonLevel3(group, phase, context);
  }

  if (levelId === 4) {
    return getDeathReasonLevel4(group, phase, context);
  }

  if (levelId === 5) {
    return getDeathReasonLevel5(group, phase, context);
  }

  return null;
}
