export interface Movement {
  id: string;
  movementDate: string;
  movementType: 'CREDIT' | 'DEBIT';
  amount: number;
  availableBalance: number;
}
