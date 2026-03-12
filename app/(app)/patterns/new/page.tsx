import { NewPatternForm } from "@/components/patterns/NewPatternForm";
import Link from "next/link";

export default function NewPatternPage() {
  return (
    <div>
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1e1e1e]">
        <Link
          href="/patterns"
          className="text-neutral-500 hover:text-neutral-200 transition text-sm"
        >
          ← Patterns
        </Link>
        <h1 className="text-xl font-semibold text-white">New pattern</h1>
      </div>
      <div className="px-6 py-6">
        <NewPatternForm />
      </div>
    </div>
  );
}
