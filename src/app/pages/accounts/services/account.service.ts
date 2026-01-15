import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Account } from '../models/account.model';
import { environment } from '../../../../enviroment/environment';

export interface CreateAccountRequest {
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  active: boolean;
  customerId: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getByCustomer(customerId: string) {
    return this.http.get<Account[]>(`${this.baseUrl}?customerId=${customerId}`);
  }

  create(payload: CreateAccountRequest) {
    return this.http.post<Account>(this.baseUrl, payload);
  }
}
