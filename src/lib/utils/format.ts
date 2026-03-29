export function formatPrice(price: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Akkurat nå";
  if (diffMins < 60) return `${diffMins} min siden`;
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays < 7) return `${diffDays} dager siden`;

  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function conditionLabel(value: string): string {
  const map: Record<string, string> = {
    ny: "Ny",
    som_ny: "Som ny",
    pent_brukt: "Pent brukt",
    brukt: "Brukt",
    slitt: "Godt brukt",
  };
  return map[value] || value;
}

export function handLabel(value: string | null): string | null {
  if (!value) return null;
  return value === "right" ? "Høyre" : "Venstre";
}
