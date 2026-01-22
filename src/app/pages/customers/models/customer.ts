export interface Customer {
  id: string;
  fullName: string;
  identification: string;
  address: string;
  phone: string;
  status: boolean;
  password?: string;
}
