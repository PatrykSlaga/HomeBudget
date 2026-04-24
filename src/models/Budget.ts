export interface Budget {
  id: string;
  userId: string;
  month: string;
  plannedAmount: number;
  warningThreshold: number;
  createdAt: string;
}