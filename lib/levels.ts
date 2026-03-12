const LEVEL_INFO: Array<{ steps: number; pointsPerStep: number; totalPoints: number }> = [
  { steps: 9, pointsPerStep: 10, totalPoints: 90 },
  { steps: 9, pointsPerStep: 15, totalPoints: 135 },
  { steps: 9, pointsPerStep: 25, totalPoints: 225 },
  { steps: 9, pointsPerStep: 40, totalPoints: 360 },
  { steps: 9, pointsPerStep: 65, totalPoints: 585 },
  { steps: 9, pointsPerStep: 105, totalPoints: 945 },
];

export interface LevelState {
  totalPoints: number;
  currentLevel: number;
  currentStep: number;
  progress: number; // 0–1 fraction through current step
  pointsForNextStep: number;
  pointsForNextLevel: number;
  pointsEarnedInLevel: number;
}

export function calculateLevelState(totalPoints: number): LevelState {
  let remaining = totalPoints;
  let level = 1;
  let step = 1;

  for (let i = 0; i < LEVEL_INFO.length; i++) {
    const info = LEVEL_INFO[i];
    if (remaining < info.totalPoints) {
      level = i + 1;
      step = Math.min(Math.floor(remaining / info.pointsPerStep) + 1, info.steps);
      break;
    }
    remaining -= info.totalPoints;
    if (i === LEVEL_INFO.length - 1) {
      level = LEVEL_INFO.length;
      step = info.steps;
    }
  }

  const levelIndex = level - 1;
  const cappedIndex = Math.min(levelIndex, LEVEL_INFO.length - 1);
  const info = LEVEL_INFO[cappedIndex];

  const pointsBeforeLevel = LEVEL_INFO.slice(0, levelIndex).reduce(
    (sum, l) => sum + l.totalPoints,
    0
  );
  const pointsInLevel = Math.max(0, totalPoints - pointsBeforeLevel);
  const pointsInCurrentStep = pointsInLevel % info.pointsPerStep;
  const progress = pointsInCurrentStep / info.pointsPerStep;

  const nextLevelTotal = LEVEL_INFO.slice(0, cappedIndex + 1).reduce(
    (sum, l) => sum + l.totalPoints,
    0
  );
  const pointsForNextLevel = Math.max(0, nextLevelTotal - totalPoints);
  const targetForNextStep =
    pointsBeforeLevel + (step) * info.pointsPerStep;
  const pointsForNextStep = Math.max(0, targetForNextStep - totalPoints);

  return {
    totalPoints,
    currentLevel: level,
    currentStep: step,
    progress,
    pointsForNextStep,
    pointsForNextLevel,
    pointsEarnedInLevel: Math.min(pointsInLevel, info.totalPoints),
  };
}

export { LEVEL_INFO };
