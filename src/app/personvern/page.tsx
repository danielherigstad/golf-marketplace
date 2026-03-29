export const metadata = {
  title: "Personvern",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Personvernerklæring
      </h1>
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            1. Hvilke data samler vi inn?
          </h2>
          <p>
            Vi samler inn informasjon du gir oss ved registrering (navn,
            e-post, eventuelt telefonnummer og sted), samt data knyttet til
            annonser du oppretter og meldinger du sender.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            2. Hvordan bruker vi dataene?
          </h2>
          <p>
            Dataene brukes for å drifte tjenesten — vise annonser, muliggjøre
            kommunikasjon mellom brukere, og forbedre brukeropplevelsen.
            Vi selger aldri dataene dine til tredjeparter.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            3. Lagring
          </h2>
          <p>
            Dataene lagres sikkert hos Supabase (EU-region). Bilder lagres
            i Supabase Storage. Du kan når som helst slette kontoen din og
            alle tilknyttede data.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            4. Dine rettigheter
          </h2>
          <p>
            Du har rett til innsyn, retting og sletting av dine
            personopplysninger i henhold til GDPR. Kontakt oss på{" "}
            <a
              href="mailto:hei@golfmarked.no"
              className="text-green-600 hover:underline"
            >
              hei@golfmarked.no
            </a>{" "}
            for å utøve dine rettigheter.
          </p>
        </section>
      </div>
    </div>
  );
}
