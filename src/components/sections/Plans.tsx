import { plans } from "../../content/plans";
import { backgroundsForPlan } from "../../lib/art";
import AppIcon from "../AppIcon";

/** How many calendar backgrounds each plan shows of the ones it adds. */
const shownBackgrounds = 8;

export default function Plans() {
  return (
    <section id="plans" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-4xl font-bold">Plans</h2>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const backgrounds = backgroundsForPlan(plan.id);
          // Spread the sample across the set, so gradients, patterns and textures all appear.
          const sample = Array.from({ length: Math.min(shownBackgrounds, backgrounds.length) }, (_, index) =>
            backgrounds[Math.floor((index * backgrounds.length) / shownBackgrounds)]);

          return (
            <li key={plan.id} className="plan-card flex flex-col rounded-3xl p-6" data-plan={plan.id}>
              <h3 className="flex items-center gap-3 text-3xl font-bold">
                <span className="plan-metal h-5 w-5 rounded-full" aria-hidden="true" />
                {plan.name}
              </h3>
              <ul className="mt-6 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <AppIcon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <p className="text-sm text-ink-60">
                  {plan.id === "free"
                    ? `${backgrounds.length} calendar backgrounds`
                    : `${backgrounds.length} more calendar backgrounds`}
                </p>
                <ul className="mt-3 grid grid-cols-4 gap-2">
                  {sample.map((background) => (
                    <li key={background.id}>
                      <img
                        className="aspect-[3/4] w-full rounded-lg border border-mist bg-art-ground object-cover"
                        src={background.file}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
