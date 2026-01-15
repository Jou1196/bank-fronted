export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;   // SAVINGS / CHECKING
  initialBalance: number;
  active: boolean;
  customerId: string;
}
