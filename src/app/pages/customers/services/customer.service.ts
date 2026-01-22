import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment/environment';
import { Customer } from '../models/customer';

export interface CustomerCreateRequest {
  identification: string;
  phone: string;
  password: string;
  fullName: string;
  address: string;
  status: boolean;
}

export interface CustomerUpdateRequest {
  phone: string;
  password: string;
  fullName: string;
  address: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  create(payload: CustomerCreateRequest) {
    return this.http.post<any>(this.baseUrl, payload);
  }

  update(id: string, payload: CustomerUpdateRequest) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
