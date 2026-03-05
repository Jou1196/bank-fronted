import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = `${environment.reportApi}/reportes`;

  constructor(private http: HttpClient) {}

  estadoCuenta(customerId: string, from: string, to: string) {
    const params = new HttpParams()
      .set('customerId', customerId)
      .set('from', from)
      .set('to', to);

    return this.http.get(`${this.baseUrl}/estado-cuenta`, { params });
  }
}