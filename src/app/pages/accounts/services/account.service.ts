import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment/environment';
import { Account } from '../models/account.model';

export interface CreateAccountRequest {
  accountNumber: string;
  type: 'AHORRO' | 'CORRIENTE';
  initialBalance: number;
  status: boolean;
  customerId: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/cuentas`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Account[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getByCustomer(customerId: string) {
    return this.http.get<Account[]>(`${this.baseUrl}/por-cliente/${customerId}`);
  }

  create(payload: CreateAccountRequest) {
    return this.http.post<any>(this.baseUrl, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
