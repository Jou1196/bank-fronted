export interface Movement {
  id: string;
  accountId: string;


  accountNumber?: string;

  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;

  balanceBefore: number;
  balanceAfter: number;

  movementDate: string; 
  createdAt?: string;  
}
