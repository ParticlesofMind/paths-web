import appStore from "../../content/app-store.json";
import { home } from "../../content/home";
import { site } from "../../content/site";
import AppScreen from "../AppScreen";
import DownloadLink from "../DownloadLink";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <p className="text-ink-60">{appStore.subtitle}</p>
        <h1 className="mt-2 text-6xl font-bold">{site.name}</h1>
        <p className="mt-6 max-w-md text-xl">{home.hero}</p>
        <p className="mt-4 text-ink-60">For {site.platform}.</p>
        <div className="mt-8">
          <DownloadLink />
        </div>
      </div>
      {/* The upright iPad stands in the middle of the stage; the iPhone and the Watch stand in
          front of its lower corners. Each wrapper sets a size as a share of the stage, so the
          group scales as one. */}
      <div className="relative mx-auto w-full max-w-[560px] pb-[6%]">
        <div className="ml-[17%] w-[62%]">
          <AppScreen id="ipad-progress" alt="The Athlete's Progress world in Paths on iPad: a road through a park" width={347} tilt="flat" eager />
        </div>
        <div className="absolute bottom-0 left-0 w-[30%]">
          <AppScreen id="progress" alt="The Explorer's Progress world in Paths on iPhone: a road winding through fields of tulips" width={168} tilt="flat" eager />
        </div>
        <div className="absolute right-0 bottom-[12%] w-[22%]">
          <AppScreen id="watch-schedule" alt="The Paths schedule on Apple Watch, with a run in progress" width={123} tilt="flat" eager />
        </div>
      </div>
    </section>
  );
}
