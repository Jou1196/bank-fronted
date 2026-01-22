import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement.model';
import { environment } from '../../../../enviroment/environment';

export type MovementType = 'DEPOSIT' | 'WITHDRAWAL';

export interface MovementCreateRequest {
  accountId: string;
  amount: number;
  type: MovementType;
}

@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly baseUrl = `${environment.apiUrl}/movimientos`;

  constructor(private http: HttpClient) {}

  getByAccount(accountId: string): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.baseUrl}/por-cuenta/${accountId}`);
  }

  create(req: MovementCreateRequest): Observable<Movement> {
    return this.http.post<Movement>(this.baseUrl, req);
  }
}
