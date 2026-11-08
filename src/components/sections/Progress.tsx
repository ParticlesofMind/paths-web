import { home } from "../../content/home";
import { badgeFamilies } from "../../lib/art";
import AppClip from "../AppClip";
import AppScreen from "../AppScreen";

export default function Progress() {
  return (
    <section id="progress" className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="flex justify-center gap-6">
          <AppClip id="progress-world" label="Travelling along the road through the first Progress world" width={240} tilt="left" />
          <AppScreen id="progress-badges" alt="A badge in the Progress tab" width={240} tilt="right" className="hidden lg:block" />
        </div>
        <div>
          <h2 className="text-4xl font-bold">A road you walk by practicing</h2>
          {home.progress.map((paragraph) => (
            <p key={paragraph} className="mt-6 max-w-md text-xl">{paragraph}</p>
          ))}
        </div>
      </div>
      {/* From md up each family is a column, its tiers running down. Phones are too narrow
          for five columns, so there each family is a row of its three badges. */}
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-3">
        {badgeFamilies.map(({ family, badges }) => (
          <section key={family} aria-label={`${family} badges`}>
            <h3 className="text-xl font-bold md:text-center">{family}</h3>
            <ul className="mt-3 grid grid-cols-3 gap-2 md:mt-4 md:grid-cols-1 md:gap-3">
              {badges.map((badge) => (
                // Hover or focus turns the card over to what the badge means. Phone-sized
                // cards are too small for the text, so the card turns from md up.
                <li key={badge.number} tabIndex={0} className="group rounded-3xl text-center perspective-distant">
                  <div className="relative transition-transform duration-500 transform-3d motion-reduce:transition-none md:group-hover:rotate-y-180 md:group-focus:rotate-y-180">
                    <div className="rounded-3xl bg-art-ground p-2 backface-hidden sm:p-4">
                      <img
                        className="aspect-square w-full object-contain"
                        src={badge.file}
                        width={badge.width}
                        height={badge.height}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <p className="mt-3 flex h-8 items-center justify-center text-xs leading-tight font-semibold break-words sm:mt-4 lg:h-auto lg:text-sm lg:whitespace-nowrap">
                        {badge.name}
                      </p>
                    </div>
                    <p className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-3xl bg-art-ground p-4 text-xs leading-snug rotate-y-180 backface-hidden lg:p-5 lg:text-sm">
                      {badge.meaning}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
