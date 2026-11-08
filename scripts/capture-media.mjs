#!/usr/bin/env node
// Captures the site's screenshots and screen recordings from the Paths app,
// and writes them where the site reads them. iPhone shots run on the physical
// iPhone. iPad and Apple Watch shots (`device` in media/shots.json) run in the
// simulators, by the user's decision: no iPad or Watch is connected for capture.
//
//   npm run media                     every still and clip in media/shots.json
//   npm run media -- schedule feed    only these ids
//   npm run media -- --no-build       reuse the last build of the app
//   npm run media -- --variants       no capture: rebuild the web sizes from media/stills
//   npm run media -- --draft          trial run for writing clips: recordings, and the
//                                     screens and accessibility trees of `snapshot`
//                                     steps, go to .media-cache/draft; the site's
//                                     media stay untouched. PATHS_MEDIA_SHOTS points
//                                     at a shot list other than media/shots.json.
//
// The shot list lives in media/shots.json. The iOS repo only holds the generic
// runner (PathsMediaUITests), so adding or changing a shot never touches it.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iosDir = resolve(process.env.PATHS_IOS_DIR ?? join(root, "..", "Paths"));
const deviceId = process.env.PATHS_DEVICE_ID ?? "A7217B72-42C9-550B-9D6F-C66DD96E53EA";
// Simulators, by name; the newest runtime wins. PATHS_IPAD_SIMULATOR_ID and
// PATHS_WATCH_SIMULATOR_ID pick a specific one.
const ipadSimulator = { name: "iPad Pro 13-inch (M5)", id: process.env.PATHS_IPAD_SIMULATOR_ID };
const watchSimulator = { name: "Apple Watch Series 11 (46mm)", id: process.env.PATHS_WATCH_SIMULATOR_ID };
const watchBundleId = "com.particlesofmind.paths.watchkitapp";
const maxClips = 12; // testClip01...testClip12 in WebsiteMediaTests.swift
const clipWidth = 720;
const endMargin = 0.8; // seconds cut from the end of every clip
const stillWidths = [480, 960]; // web sizes made from each full-resolution master

const args = process.argv.slice(2);
const skipBuild = args.includes("--no-build");
const variantsOnly = args.includes("--variants");
const draft = args.includes("--draft");
const onlyIds = args.filter((arg) => !arg.startsWith("--"));

const fail = (message) => {
  console.error(`\n${message}`);
  process.exit(1);
};

if (!existsSync(join(iosDir, "Paths.xcodeproj"))) {
  fail(`Paths iOS repo not found at ${iosDir}. Set PATHS_IOS_DIR.`);
}

const mastersDir = join(root, "media", "stills");
const stillsDir = join(root, "public", "media", "stills");
const clipsDir = join(root, "public", "media", "clips");
const manifestPath = join(root, "src", "data", "media.json");
for (const dir of [mastersDir, stillsDir, clipsDir, dirname(manifestPath)]) mkdirSync(dir, { recursive: true });

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { stills: {}, clips: {} };

const fullPlan = JSON.parse(readFileSync(process.env.PATHS_MEDIA_SHOTS ?? join(root, "media", "shots.json"), "utf8"));
/** Which body the site draws around a still: `iphone`, `ipad` or `watch`. */
const deviceOf = (id) => fullPlan.stills.find((shot) => shot.id === id)?.device ?? "iphone";

const probe = (file) => {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration", "-of", "json", file,
  ], { encoding: "utf8" });
  const parsed = JSON.parse(out);
  return { width: parsed.streams[0].width, height: parsed.streams[0].height, duration: Number(parsed.format.duration) };
};

// Every master in media/stills gets its web sizes and a manifest entry.
const buildStillVariants = (stamp = {}) => {
  for (const file of readdirSync(mastersDir).filter((name) => name.endsWith(".png"))) {
    const id = file.slice(0, -4);
    const master = join(mastersDir, file);
    const { width, height } = probe(master);
    const variants = stillWidths.map((variantWidth) => {
      const out = join(stillsDir, `${id}-${variantWidth}.webp`);
      execFileSync("cwebp", ["-quiet", "-q", "84", "-resize", String(variantWidth), "0", master, "-o", out]);
      return { width: variantWidth, file: `/media/stills/${id}-${variantWidth}.webp` };
    });
    const previous = manifest.stills[id] ?? {};
    manifest.stills[id] = {
      device: deviceOf(id), width, height, variants,
      capturedAt: stamp[id]?.capturedAt ?? previous.capturedAt,
      appCommit: stamp[id]?.appCommit ?? previous.appCommit,
    };
  }
  for (const id of Object.keys(manifest.stills)) {
    if (!existsSync(join(mastersDir, `${id}.png`))) delete manifest.stills[id];
  }
};

const finish = () => {
  // A clip taken out of media/shots.json leaves the site with its files.
  const listed = new Set(fullPlan.clips.map((clip) => clip.id));
  for (const id of Object.keys(manifest.clips)) {
    if (listed.has(id)) continue;
    for (const extension of [".mp4", ".jpg"]) rmSync(join(clipsDir, `${id}${extension}`), { force: true });
    delete manifest.clips[id];
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  // Keep a copy with the rest of the app's generated images.
  const mirror = join(iosDir, "Methods_Images", "website-media");
  if (existsSync(join(iosDir, "Methods_Images"))) {
    mkdirSync(mirror, { recursive: true });
    for (const file of readdirSync(mastersDir)) copyFileSync(join(mastersDir, file), join(mirror, file));
    for (const file of readdirSync(clipsDir)) copyFileSync(join(clipsDir, file), join(mirror, file));
  }
};

if (variantsOnly) {
  buildStillVariants();
  finish();
  console.log(`Rebuilt web sizes for ${Object.keys(manifest.stills).length} stills.`);
  process.exit(0);
}

// --- Plan -------------------------------------------------------------------

const wanted = (shot) => onlyIds.length === 0 || onlyIds.includes(shot.id);
const plan = { stills: fullPlan.stills.filter(wanted), clips: fullPlan.clips.filter(wanted) };

const known = new Set([...fullPlan.stills, ...fullPlan.clips].map((shot) => shot.id));
const unknown = onlyIds.filter((id) => !known.has(id));
if (unknown.length) fail(`Not in media/shots.json: ${unknown.join(", ")}`);
if (plan.clips.length > maxClips) fail(`At most ${maxClips} clips per run; capture the rest by id.`);
if (plan.clips.some((clip) => (clip.device ?? "iphone") !== "iphone")) fail("Clips are captured on the iPhone only.");
if (!plan.stills.length && !plan.clips.length) fail("Nothing to capture.");

const onDevice = (device) => plan.stills.filter((shot) => (shot.device ?? "iphone") === device);
const phonePlan = { stills: onDevice("iphone"), clips: plan.clips };
const ipadPlan = { stills: onDevice("ipad"), clips: [] };
const watchStills = onDevice("watch");

const cache = join(root, ".media-cache");
const draftDir = join(cache, "draft");
mkdirSync(cache, { recursive: true });
if (draft) rmSync(draftDir, { recursive: true, force: true });
const capturedAt = new Date().toISOString();
const appCommit = spawnSync("git", ["-C", iosDir, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).stdout.trim();
const stamp = {};
const done = [];
const missing = [];

const saveStill = (id) => {
  stamp[id] = { capturedAt, appCommit };
  done.push(`still ${id}`);
};

// --- Simulators -------------------------------------------------------------

const simulator = ({ name, id }) => {
  if (id) return id;
  const { devices } = JSON.parse(execFileSync("xcrun", ["simctl", "list", "devices", "available", "-j"], { encoding: "utf8" }));
  const runtimes = Object.keys(devices).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  for (const runtime of runtimes) {
    const found = devices[runtime].find((device) => device.name === name);
    if (found) return found.udid;
  }
  fail(`No "${name}" simulator. Create one in Xcode, or set its id in the environment.`);
};

const boot = (udid) => {
  spawnSync("xcrun", ["simctl", "boot", udid]); // fails harmlessly when already booted
  execFileSync("xcrun", ["simctl", "bootstatus", udid, "-b"], { stdio: "ignore" });
  // The time Apple shows in its own product pictures, and a full battery. watchOS has no override.
  spawnSync("xcrun", ["simctl", "status_bar", udid, "override", "--time", "9:41", "--batteryState", "charged",
    "--batteryLevel", "100", "--wifiBars", "3", "--cellularBars", "4"]);
};

// --- Run the capture tests --------------------------------------------------

// `{session}` in a shot's arguments becomes a new id on every run, so a method
// opens empty instead of restoring what an earlier capture left in it.
const withSessions = ({ stills, clips }) => {
  const fresh = (shot) => ({ ...shot, arguments: shot.arguments?.map((argument) => (argument === "{session}" ? randomUUID() : argument)) });
  return { stills: stills.map(fresh), clips: clips.map(fresh) };
};

// Runs PathsMediaUITests against one destination and sorts what it attached.
const runCaptureTests = (label, destination, devicePlan) => {
  const resultBundle = join(cache, `capture-${label}.xcresult`);
  const exported = join(cache, `attachments-${label}`);
  rmSync(resultBundle, { recursive: true, force: true });
  rmSync(exported, { recursive: true, force: true });

  const suite = "PathsMediaUITests/WebsiteMediaTests";
  const tests = [
    ...(devicePlan.stills.length ? ["testStills"] : []),
    ...devicePlan.clips.map((_, index) => `testClip${String(index + 1).padStart(2, "0")}`),
  ];

  const xcodebuild = spawnSync(
    "xcodebuild",
    [
      skipBuild ? "test-without-building" : "test",
      "-project", join(iosDir, "Paths.xcodeproj"),
      "-scheme", "PathsWebsiteMedia",
      "-destination", destination,
      "-allowProvisioningUpdates",
      "-resultBundlePath", resultBundle,
      ...tests.map((test) => `-only-testing:${suite}/${test}`),
    ],
    {
      encoding: "utf8",
      maxBuffer: 1 << 28,
      env: { ...process.env, TEST_RUNNER_PATHS_MEDIA_PLAN: Buffer.from(JSON.stringify(withSessions(devicePlan))).toString("base64") },
    },
  );
  const log = join(cache, `xcodebuild-${label}.log`);
  writeFileSync(log, (xcodebuild.stdout ?? "") + (xcodebuild.stderr ?? ""));
  if (!existsSync(resultBundle)) fail(`xcodebuild produced no result bundle. See ${log}`);

  execFileSync("xcrun", ["xcresulttool", "export", "attachments", "--path", resultBundle, "--output-path", exported]);
  const exportManifest = JSON.parse(readFileSync(join(exported, "manifest.json"), "utf8"));

  for (const entry of exportManifest) {
    const testName = entry.testIdentifier ?? "";
    const files = (entry.attachments ?? []).map((attachment) => ({
      name: attachment.suggestedHumanReadableName ?? "",
      path: join(exported, attachment.exportedFileName),
    }));

    for (const file of files) {
      // A `snapshot` step's screen and accessibility tree, for writing clips.
      const snapshot = file.name.match(/^(frame|tree)--(.+?)--(\d+)/);
      if (snapshot) {
        mkdirSync(draftDir, { recursive: true });
        copyFileSync(file.path, join(draftDir, `${snapshot[2]}-${snapshot[3]}.${snapshot[1] === "frame" ? "png" : "txt"}`));
        continue;
      }
      // Xcode appends _<n>_<uuid> to the attachment name.
      const still = file.name.match(/^still--(.+?)(_\d+_[0-9A-F-]{36})?(\.png)?$/i);
      if (!still) continue;
      const id = still[1];
      if (draft) {
        mkdirSync(draftDir, { recursive: true });
        copyFileSync(file.path, join(draftDir, `${id}.png`));
        saveStill(id);
        continue;
      }
      const master = join(mastersDir, `${id}.png`);
      copyFileSync(file.path, master);
      // `trim` keeps only the artwork: the status bar and home indicator are cut
      // off, then the plain background around what is left.
      if (devicePlan.stills.find((shot) => shot.id === id)?.trim) {
        execFileSync("magick", [master, "-gravity", "North", "-chop", "0x240", "-gravity", "South", "-chop", "0x160",
          "-fuzz", "3%", "-trim", "+repage", master]);
      }
      // XCUIScreen hands back the pixels in portrait order even when the device
      // is turned; turn a landscape shot back upright.
      if (devicePlan.stills.find((shot) => shot.id === id)?.orientation === "landscape") {
        const { width, height } = probe(master);
        if (height > width) execFileSync("magick", [master, "-rotate", "-90", master]);
      }
      saveStill(id);
    }

    const clipTest = testName.match(/testClip(\d+)/);
    if (!clipTest) continue;
    const clip = devicePlan.clips[Number(clipTest[1]) - 1];
    if (!clip) continue;

    const recording = files.find((file) => [".mp4", ".mov"].includes(extname(file.path).toLowerCase()));
    const timingFile = files.find((file) => file.name.startsWith(`timing--${clip.id}_`) || file.name === `timing--${clip.id}`);
    if (!recording || !timingFile) {
      missing.push(`clip ${clip.id}`);
      continue;
    }

    if (draft) {
      mkdirSync(draftDir, { recursive: true });
      copyFileSync(recording.path, join(draftDir, `${clip.id}${extname(recording.path)}`));
      copyFileSync(timingFile.path, join(draftDir, `${clip.id}-timing.json`));
      done.push(`clip ${clip.id}`);
      continue;
    }

    // The recording starts with the test, so it opens on the home screen and the
    // app launching. Cut to the moment the scenario was settled.
    const timing = JSON.parse(readFileSync(timingFile.path, "utf8"));
    const start = Math.max(0, timing.start + (clip.trimStart ?? 0));
    // The video can run a moment ahead of the test's clock, so the app closing
    // and the home screen would show in the last frames. Stop short of that.
    const length = Math.max(0.5, timing.end - timing.start - endMargin + (clip.trimEnd ?? 0));
    const mp4 = join(clipsDir, `${clip.id}.mp4`);
    const poster = join(clipsDir, `${clip.id}.jpg`);

    execFileSync("ffmpeg", [
      "-y", "-v", "error", "-ss", String(start), "-t", String(length), "-i", recording.path,
      "-an", "-vf", `scale=${clipWidth}:-2`, "-c:v", "libx264", "-preset", "slow", "-crf", "24",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4,
    ]);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", mp4, "-frames:v", "1", "-q:v", "3", poster]);

    const { width, height, duration } = probe(mp4);
    manifest.clips[clip.id] = {
      file: `/media/clips/${clip.id}.mp4`, poster: `/media/clips/${clip.id}.jpg`,
      width, height, duration, capturedAt, appCommit,
    };
    done.push(`clip ${clip.id}`);
  }
};

// --- iPhone -----------------------------------------------------------------

if (phonePlan.stills.length || phonePlan.clips.length) {
  const devices = spawnSync("xcrun", ["devicectl", "list", "devices"], { encoding: "utf8" }).stdout ?? "";
  const deviceLine = devices.split("\n").find((line) => line.includes(deviceId));
  if (!deviceLine || /unavailable/.test(deviceLine)) {
    fail("The iPhone is not connected. iPhone captures only run on the physical device.");
  }
  console.log(`Capturing ${phonePlan.stills.length} stills and ${phonePlan.clips.length} clips on the iPhone. Keep it unlocked.`);
  runCaptureTests("iphone", `id=${deviceId}`, phonePlan);
}

// --- iPad -------------------------------------------------------------------

if (ipadPlan.stills.length) {
  const udid = simulator(ipadSimulator);
  console.log(`Capturing ${ipadPlan.stills.length} stills in the iPad simulator.`);
  boot(udid);
  runCaptureTests("ipad", `platform=iOS Simulator,id=${udid}`, ipadPlan);
}

// --- Apple Watch ------------------------------------------------------------

// The Watch app has no UI-test target. It opens its sample schedule from the
// same -VisualAuditScenario launch argument (PathsWatch/WatchVisualAudit.swift),
// and the simulator takes the screenshot. watchOS is always dark, so `dark` does
// nothing here.
if (watchStills.length) {
  const udid = simulator(watchSimulator);
  const derivedData = join(cache, "watch-build");
  const app = join(derivedData, "Build", "Products", "Debug-watchsimulator", "PathsWatch.app");
  console.log(`Capturing ${watchStills.length} stills in the Apple Watch simulator.`);
  if (!skipBuild || !existsSync(app)) {
    const build = spawnSync("xcodebuild", [
      "build", "-project", join(iosDir, "Paths.xcodeproj"), "-scheme", "PathsWatch",
      "-destination", `platform=watchOS Simulator,id=${udid}`, "-derivedDataPath", derivedData,
    ], { encoding: "utf8", maxBuffer: 1 << 28 });
    const log = join(cache, "xcodebuild-watch.log");
    writeFileSync(log, (build.stdout ?? "") + (build.stderr ?? ""));
    if (build.status !== 0 || !existsSync(app)) fail(`The Watch app did not build. See ${log}`);
  }
  boot(udid);
  execFileSync("xcrun", ["simctl", "install", udid, app]);
  for (const shot of watchStills) {
    const launchArguments = ["-VisualAuditScenario", shot.scenario, ...(shot.arguments ?? [])];
    execFileSync("xcrun", ["simctl", "launch", "--terminate-running-process", udid, watchBundleId, ...launchArguments],
      { stdio: "ignore" });
    execFileSync("sleep", [String(shot.settle ?? 3)]);
    execFileSync("xcrun", ["simctl", "io", udid, "screenshot", join(mastersDir, `${shot.id}.png`)], { stdio: "ignore" });
    spawnSync("xcrun", ["simctl", "terminate", udid, watchBundleId]);
    saveStill(shot.id);
  }
}

// --- Finish -----------------------------------------------------------------

for (const shot of plan.stills) if (!done.includes(`still ${shot.id}`)) missing.push(`still ${shot.id}`);
for (const clip of plan.clips) {
  if (!done.includes(`clip ${clip.id}`) && !missing.includes(`clip ${clip.id}`)) missing.push(`clip ${clip.id}`);
}

if (draft) {
  console.log(`\nDraft: ${done.join(", ") || "nothing"}. See ${draftDir}`);
  process.exit(missing.length ? 1 : 0);
}

buildStillVariants(stamp);
finish();

console.log(`\nCaptured: ${done.join(", ") || "nothing"}`);
if (missing.length) fail(`Missing: ${missing.join(", ")}. See the xcodebuild logs in ${cache}`);
