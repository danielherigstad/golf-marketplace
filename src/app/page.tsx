import Link from "next/link";
import {
  Target,
  TreePine,
  CircleDot,
  Briefcase,
  Circle,
  Shirt,
  Footprints,
  Navigation,
  Dumbbell,
  Puzzle,
  Package,
  Layers,
  Crosshair,
  ArrowRight,
} from "lucide-react";

const categories = [
  { name: "Drivere", slug: "drivere", icon: Target },
  { name: "Fairwaywood", slug: "fairwaywood", icon: TreePine },
  { name: "Hybrider", slug: "hybrider", icon: Crosshair },
  { name: "Jernsett", slug: "jernsett", icon: Layers },
  { name: "Wedger", slug: "wedger", icon: CircleDot },
  { name: "Puttere", slug: "puttere", icon: Navigation },
  { name: "Bagger", slug: "bagger", icon: Briefcase },
  { name: "Baller", slug: "baller", icon: Circle },
  { name: "Klaer", slug: "klaer", icon: Shirt },
  { name: "Sko", slug: "sko", icon: Footprints },
  { name: "GPS & Malere", slug: "gps-avstandsmalere", icon: Navigation },
  { name: "Treningsutstyr", slug: "treningsutstyr", icon: Dumbbell },
  { name: "Tilbehor", slug: "tilbehor", icon: Puzzle },
  { name: "Komplettsett", slug: "komplettsett", icon: Package },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kjop og selg brukt golfutstyr
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Norges storste markedsplass for golfutstyr. Finn akkurat det du
            leter etter — med filtre for merke, modell, flex og mer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/annonser"
              className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              Bla i annonser
            </Link>
            <Link
              href="/annonser/ny"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg border-2 border-green-500 hover:bg-green-500 transition-colors"
            >
              Legg ut gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategorier</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map(({ name, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={`/kategori/${slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
            >
              <Icon className="h-8 w-8 text-gray-600 group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium text-gray-700 text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Slik fungerer det
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Opprett konto</h3>
              <p className="text-gray-600">
                Registrer deg gratis pa sekunder med e-post eller Google.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Legg ut annonse</h3>
              <p className="text-gray-600">
                Last opp bilder, velg kategori og fyll inn detaljer. Helt
                gratis!
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Handle trygt</h3>
              <p className="text-gray-600">
                Chat med kjoper eller selger direkte i appen og avtal
                overlevering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-green-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Har du golfutstyr du ikke bruker?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Legg det ut pa GolfMarked helt gratis. Na tusenvis av golfere over
            hele Norge.
          </p>
          <Link
            href="/annonser/ny"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Legg ut annonse
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
