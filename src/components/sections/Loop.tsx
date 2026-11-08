import { loop } from "../../content/loop";
import AppScreen from "../AppScreen";

export default function Loop() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-4xl font-bold">How it works</h2>
      {/* On phones the steps sit in a row you swipe through, the next one peeking in;
          from sm up they form a grid. */}
      <ol className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {loop.map((step) => (
          <li key={step.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <AppScreen id={step.still} alt={step.stillAlt} width={220} />
            <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-ink-60">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
