export interface Account {
  id: string;
  ownerId: string;
  displayName: string;
  banUntil: string | null;
  banCounter: number;
  totalBanTime: number;
  lastBanTime: number;
  previousLastBanTime: number;
}
