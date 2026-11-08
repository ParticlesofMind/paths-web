import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { home } from "../../content/home";
import { methods } from "../../content/methods";
import { patternsForMethod } from "../../lib/art";
import AppClip from "../AppClip";
import AppIcon from "../AppIcon";
import AppScreen from "../AppScreen";
import PatternChips from "../PatternChips";

/** How far a swipe must travel, in CSS pixels, to change the slide. */
const swipeDistance = 50;

/**
 * The nine methods as a slideshow, one short how-to per slide. Hydrated in the
 * page (`client:visible`); without JavaScript the first slide shows and the
 * tabs do nothing.
 */
export default function Methods() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);
  const section = useRef<HTMLElement>(null);

  // Only the shown slide's recording plays, from the start, and only while the section
  // is on screen. Hidden slides stay laid out, so the page-wide autoplay would play them all.
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        methods.forEach((method, index) => {
          const video = element.querySelector<HTMLVideoElement>(`#method-${method.id} video`);
          if (!video) return;
          const play = entry.isIntersecting && index === current && !reduced && video.offsetParent !== null;
          if (play) {
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [current]);

  const go = (index: number, focusTab = false) => {
    const next = (index + methods.length) % methods.length;
    setCurrent(next);
    const tab = document.getElementById(`method-tab-${methods[next].id}`);
    // On phones the tabs scroll sideways; keep the chosen one in view without moving the page.
    tab?.parentElement?.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
    if (focusTab) tab?.focus({ preventScroll: true });
  };

  const onTabKey = (event: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1,
      Home: 0, End: methods.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    go(moves[event.key], true);
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) >= swipeDistance) go(current + (distance < 0 ? 1 : -1));
  };

  return (
    <section ref={section} id="methods" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-4xl font-bold">Nine ways to show your work</h2>
      <p className="mt-6 max-w-2xl text-xl">{home.methods}</p>

      {/* From lg up the tabs stand in a column to the left of the slide; below that they run in a row above it. */}
      <div
        className="mt-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-6"
        role="region"
        aria-roledescription="carousel"
        aria-label="The nine methods"
      >
        <div
          role="tablist"
          aria-label="Methods"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 lg:flex-col lg:pb-0"
          onKeyDown={onTabKey}
        >
          {methods.map((method, index) => {
            const selected = index === current;
            return (
              <button
                key={method.id}
                type="button"
                role="tab"
                id={`method-tab-${method.id}`}
                aria-controls={`method-${method.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(index)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-left lg:w-full ${
                  selected ? "border-ink bg-ink text-paper" : "border-mist bg-surface"
                }`}
              >
                <AppIcon name={method.icon} className="h-4 w-4" />
                {method.name}
              </button>
            );
          })}
        </div>

        {/* Every slide sits in the same grid cell, so the box keeps the height of the tallest. */}
        <div
          className="mt-6 grid lg:mt-0"
          onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
          onTouchEnd={onTouchEnd}
        >
          {methods.map((method, index) => {
            const shown = index === current;
            const patterns = patternsForMethod(method.id);
            return (
              <div
                key={method.id}
                role="tabpanel"
                id={`method-${method.id}`}
                aria-labelledby={`method-tab-${method.id}`}
                aria-roledescription="slide"
                inert={!shown}
                className={`[grid-area:1/1] grid items-center gap-10 rounded-3xl border border-mist bg-surface p-6 transition-opacity duration-300 motion-reduce:transition-none md:grid-cols-[16rem_1fr] md:p-10 ${
                  shown ? "opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="hidden justify-center md:flex">
                  {method.clip ? (
                    <AppClip id={method.clip} label={`${method.name} in use in Paths`} width={220} tilt="flat" autoplay={false} />
                  ) : (
                    <AppScreen id={method.still} alt={`${method.name} in Paths`} width={220} tilt="flat" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist md:hidden">
                      <AppIcon name={method.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-3xl font-bold">{method.name}</h3>
                      <p className="mt-1 text-ink-60">Proof: {method.proof.charAt(0).toLowerCase() + method.proof.slice(1)}</p>
                    </div>
                  </div>
                  <ol className="mt-8 space-y-5">
                    {method.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-4 text-lg">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-mist text-base font-semibold">
                          {stepIndex + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                  {patterns.length > 0 && (
                    <div className="mt-8">
                      <PatternChips patterns={patterns} limit={3} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
