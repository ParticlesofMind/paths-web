"use client";

import { calculateLevelState, LEVEL_INFO } from "@/lib/levels";

interface ProgressPathProps {
  totalPoints: number;
}

export function ProgressPath({ totalPoints }: ProgressPathProps) {
  const state = calculateLevelState(totalPoints);
  const steps = 9;

  return (
    <div className="flex flex-col gap-6">
      {/* Level header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Level
          </p>
          <p className="text-4xl font-bold text-white">{state.currentLevel}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Total points
          </p>
          <p className="text-2xl font-semibold text-white">{Math.round(totalPoints)}</p>
        </div>
      </div>

      {/* Step progression */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-neutral-500">
            Step {state.currentStep} of {steps}
          </p>
          <p className="text-xs text-neutral-500">
            {Math.round(state.pointsForNextStep)} pts to next step
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: steps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < state.currentStep;
            const isCurrent = stepNum === state.currentStep;
            return (
              <div key={i} className="flex-1 relative">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted
                      ? "bg-[#4f7eff]"
                      : isCurrent
                      ? "bg-[#4f7eff]/40"
                      : "bg-[#1e1e1e]"
                  }`}
                >
                  {isCurrent && (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#4f7eff]"
                      style={{ width: `${state.progress * 100}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points for next level */}
      <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Level progress</p>
          <p className="text-xs text-neutral-400">
            {Math.round(state.pointsForNextLevel)} pts to level {state.currentLevel + 1}
          </p>
        </div>
        <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4f7eff] to-[#8b5cf6] rounded-full transition-all"
            style={{
              width: `${
                (state.pointsEarnedInLevel /
                  (LEVEL_INFO[state.currentLevel - 1]?.totalPoints ?? 1)) *
                100
              }%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-xs text-neutral-700">0</p>
          <p className="text-xs text-neutral-700">
            {LEVEL_INFO[state.currentLevel - 1]?.totalPoints ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
