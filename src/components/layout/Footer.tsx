import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">GolfMarked</h3>
            <p className="text-sm">
              Norges markedsplass for brukt golfutstyr. Kjøp og selg enkelt —
              helt gratis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Kategorier</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kategori/drivere" className="hover:text-white transition-colors">
                  Drivere
                </Link>
              </li>
              <li>
                <Link href="/kategori/jernsett" className="hover:text-white transition-colors">
                  Jernsett
                </Link>
              </li>
              <li>
                <Link href="/kategori/puttere" className="hover:text-white transition-colors">
                  Puttere
                </Link>
              </li>
              <li>
                <Link href="/kategori/bagger" className="hover:text-white transition-colors">
                  Bagger
                </Link>
              </li>
              <li>
                <Link href="/annonser" className="hover:text-white transition-colors">
                  Alle kategorier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Om oss</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/om" className="hover:text-white transition-colors">
                  Om GolfMarked
                </Link>
              </li>
              <li>
                <Link href="/vilkar" className="hover:text-white transition-colors">
                  Vilkar
                </Link>
              </li>
              <li>
                <Link href="/personvern" className="hover:text-white transition-colors">
                  Personvern
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} GolfMarked. Alle rettigheter
          reservert.
        </div>
      </div>
    </footer>
  );
}
