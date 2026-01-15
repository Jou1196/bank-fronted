import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private baseUrl = 'http://localhost:8080/movements';

  constructor(private http: HttpClient) {}

  getByAccount(accountId: string): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.baseUrl}?accountId=${accountId}`);
  }

  create(request: {
    accountId: string;
    movementDate: string;
    movementType: 'CREDIT' | 'DEBIT';
    amount: number;
  }): Observable<Movement> {
    return this.http.post<Movement>(this.baseUrl, request);
  }
}
