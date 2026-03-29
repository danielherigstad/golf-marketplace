export const metadata = {
  title: "Vilkår",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Brukervilkår
      </h1>
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            1. Generelt
          </h2>
          <p>
            Ved å bruke GolfMarked godtar du disse vilkårene. GolfMarked er
            en markedsplass som kobler kjøpere og selgere av golfutstyr.
            Vi er ikke part i transaksjoner mellom brukere.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            2. Brukerkonto
          </h2>
          <p>
            Du må opprette en konto for å legge ut annonser eller sende
            meldinger. Du er ansvarlig for å holde kontoinformasjonen din
            oppdatert og sikker.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            3. Annonser
          </h2>
          <p>
            Det er gratis å legge ut annonser. Annonser må være relatert til
            golfutstyr og inneholde korrekt informasjon. Vi forbeholder oss
            retten til å fjerne annonser som bryter med våre retningslinjer.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            4. Ansvar
          </h2>
          <p>
            GolfMarked er ikke ansvarlig for kvaliteten på utstyr som selges,
            eller for tvister mellom kjøper og selger. Alle transaksjoner
            skjer direkte mellom brukerne.
          </p>
        </section>
      </div>
    </div>
  );
}
