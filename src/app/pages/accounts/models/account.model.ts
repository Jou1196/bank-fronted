export interface Account {
  id: string;
  accountNumber: string;
  type: 'AHORRO' | 'CORRIENTE';
  initialBalance: number;
  status: boolean;
  customerId: string;
  balance?: number;
}

