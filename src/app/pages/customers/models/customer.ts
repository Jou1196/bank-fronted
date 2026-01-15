export interface Customer {
  id: string;
  customerCode: string;
  active: boolean;
  name: string;
  gender?: string | null;
  age?: number | null;
  identification?: string | null;
  address?: string | null;
  phone?: string | null;
}
