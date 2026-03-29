export const CONDITIONS = [
  { value: "ny", label: "Ny", description: "Aldri brukt, med tags/emballasje" },
  { value: "som_ny", label: "Som ny", description: "Brukt 1-2 ganger, ingen synlige merker" },
  { value: "pent_brukt", label: "Pent brukt", description: "Normal bruk, god stand" },
  { value: "brukt", label: "Brukt", description: "Tydelige bruksspor, fungerer fint" },
  { value: "slitt", label: "Godt brukt", description: "Mye bruksspor, men fungerer" },
] as const;

export type ConditionValue = (typeof CONDITIONS)[number]["value"];
