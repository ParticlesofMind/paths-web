import { archetypes } from "../../content/archetypes";
import { home } from "../../content/home";
import { patternsForArchetype } from "../../lib/art";
import Avatar from "../Avatar";
import PatternChips from "../PatternChips";

export default function Archetypes() {
  return (
    <section id="archetypes" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-4xl font-bold">Five archetypes</h2>
      <p className="mt-6 max-w-2xl text-xl">{home.archetypes}</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {archetypes.map((archetype) => (
          <li key={archetype.id} className="rounded-3xl border border-mist bg-surface p-6">
            <div className="flex -space-x-5">
              <Avatar id={`avatar-${archetype.id}-m`} alt={`The ${archetype.name} avatar in Paths`} className="border-2 border-surface" />
              <Avatar id={`avatar-${archetype.id}-f`} alt={`Another ${archetype.name} avatar in Paths`} className="border-2 border-surface" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">{archetype.name}</h3>
            <p className="mt-2">{archetype.description}</p>
            <div className="mt-5">
              <PatternChips patterns={patternsForArchetype(archetype.id)} limit={4} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
