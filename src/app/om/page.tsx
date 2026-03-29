export const metadata = {
  title: "Om oss",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Om GolfMarked</h1>
      <div className="prose prose-gray">
        <p className="text-lg text-gray-600 mb-4">
          GolfMarked er Norges markedsplass for brukt golfutstyr. Vi gjør det
          enkelt å kjøpe og selge alt fra drivere og jernsett til bagger,
          klær og tilbehør.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
          Hvorfor GolfMarked?
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li>
            <strong>Golfspesifikke filtre</strong> — søk på merke, modell,
            flex, loft, skafttype og mer. Noe Finn.no ikke tilbyr.
          </li>
          <li>
            <strong>Helt gratis</strong> — det koster ingenting å legge ut
            annonser.
          </li>
          <li>
            <strong>Chat direkte</strong> — snakk med kjøper eller selger
            rett i appen.
          </li>
          <li>
            <strong>Bygget for golfere</strong> — av golfere, for golfere.
          </li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
          Kontakt oss
        </h2>
        <p className="text-gray-600">
          Har du spørsmål eller tilbakemeldinger? Send oss en e-post på{" "}
          <a
            href="mailto:hei@golfmarked.no"
            className="text-green-600 hover:underline"
          >
            hei@golfmarked.no
          </a>
        </p>
      </div>
    </div>
  );
}
