import { site } from "../content/site";

/** The "Get the app" button: the App Store link, or a disabled button while there is no listing. */
export default function DownloadLink() {
  if (!site.appStoreUrl) {
    return (
      <div>
        <span aria-disabled="true" className="inline-block rounded-2xl bg-mist px-6 py-3 text-ink-60">
          Get the app
        </span>
        <p className="mt-3 text-ink-60">Coming to the App Store.</p>
      </div>
    );
  }

  return (
    <a href={site.appStoreUrl} className="inline-block rounded-2xl bg-ink px-6 py-3 text-paper">
      Get the app
    </a>
  );
}
