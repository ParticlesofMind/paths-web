import { site } from "../../content/site";
import DownloadLink from "../DownloadLink";

export default function Download() {
  return (
    <section id="download" className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h2 className="text-4xl font-bold">{site.name}</h2>
      <p className="mt-4 text-ink-60">For {site.platform}.</p>
      <div className="mt-8">
        <DownloadLink />
      </div>
    </section>
  );
}
