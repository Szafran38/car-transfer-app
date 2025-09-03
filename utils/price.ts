export const PRICE_PER_KM = 0.30;

export function calculatePrice(distanceMeters: number): number {
  const distanceKm = distanceMeters / 1000;
  return Math.round(distanceKm * PRICE_PER_KM * 100) / 100;
}

export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export function formatDistance(distanceMeters: number): string {
  const distanceKm = distanceMeters / 1000;
  return `${distanceKm.toFixed(1)} km`;
}