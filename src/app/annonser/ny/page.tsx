import ListingForm from "@/components/listings/ListingForm";

export const metadata = {
  title: "Ny annonse",
};

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Legg ut annonse
      </h1>
      <p className="text-gray-600 mb-8">
        Fyll inn detaljene under for å legge ut golfutstyret ditt. Det er helt
        gratis!
      </p>
      <ListingForm />
    </div>
  );
}
