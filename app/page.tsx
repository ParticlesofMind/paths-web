import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1e1e1e]">
        <span className="text-base font-semibold tracking-tight">Paths</span>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/sign-in"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-8 py-24 max-w-3xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Build habits that{" "}
          <span className="text-[#4f7eff]">last.</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed">
          Paths helps you structure your day with patterns — recurring actions
          tied to methods, times, and goals. Grow with a community.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/auth/sign-up"
            className="px-6 py-3 rounded-xl bg-[#4f7eff] text-white font-medium hover:bg-[#3d6ef0] transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/auth/sign-in"
            className="px-6 py-3 rounded-xl border border-[#2e2e2e] text-neutral-300 hover:border-[#3e3e3e] hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-8 pb-24 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Patterns",
              desc: "Define repeating routines with specific methods, days, and times.",
            },
            {
              title: "Progress",
              desc: "Earn points, reach levels, and see your growth over time.",
            },
            {
              title: "Groups",
              desc: "Join others on the same journey. Train together across time zones.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-[#1e1e1e] bg-[#111111]"
            >
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
