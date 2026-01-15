import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer';
import { environment } from '../../../../enviroment/environment';


export interface CreateCustomerRequest {
  customerCode: string;
  password: string;
  active: boolean;
  name: string;
  gender?: string | null;
  age?: number | null;
  identification?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface UpdateCustomerRequest {
  password: string;
  active: boolean;
  name: string;
  gender?: string | null;
  age?: number | null;
  identification?: string | null;
  address?: string | null;
  phone?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateCustomerRequest) {
    return this.http.post<Customer>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateCustomerRequest) {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
