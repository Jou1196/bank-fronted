import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import jsPDF from 'jspdf';
import { forkJoin } from 'rxjs';
import { environment } from '../../../enviroment/environment';

type ApiAccount = {
  id: string;
  accountNumber: string;
  type: 'AHORRO' | 'CORRIENTE' | string;
  balance: number;
  status: boolean;
  customerId: string;
};

type ApiMovement = {
  id: string;
  accountId: string;
  accountNumber?: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | string;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  movementDate: string; // "YYYY-MM-DD"
};

type ApiCustomer = {
  id: string;
  fullName?: string;
  name?: string;
  customerCode?: string;
  identification?: string;
};

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ButtonModule, DatePickerModule],
  providers: [MessageService],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  customerId = '';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  loading = false;

  private readonly API_CUSTOMERS = `${environment.apiUrl}/clientes`;
  private readonly API_ACCOUNTS = `${environment.apiUrl}/cuentas`;
  private readonly API_MOVEMENTS = `${environment.apiUrl}/movimientos`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private msg: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.queryParamMap.get('customerId') ?? '';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.fromDate = today;
    this.toDate = tomorrow;
  }

  goBackToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  downloadPdf(): void {
    if (!this.customerId) {
      this.msg.add({ severity: 'warn', summary: 'Warning', detail: 'customerId is required' });
      return;
    }

    const from = this.toIsoDate(this.fromDate);
    const to = this.toIsoDate(this.toDate);

    const customer$ = this.http.get<ApiCustomer>(`${this.API_CUSTOMERS}/${this.customerId}`);
    const accounts$ = this.http.get<ApiAccount[]>(`${this.API_ACCOUNTS}/por-cliente/${this.customerId}`);
    const movements$ = this.http.get<ApiMovement[]>(
      `${this.API_MOVEMENTS}/por-cliente`,
      { params: new HttpParams().set('customerId', this.customerId).set('from', from).set('to', to) }
    );

    this.loading = true;

    forkJoin({ customer: customer$, accounts: accounts$, movements: movements$ }).subscribe({
      next: ({ customer, accounts, movements }) => {
        this.loading = false;

        const totalDeposit = (movements ?? [])
          .filter(m => String(m.type).toUpperCase() === 'DEPOSIT')
          .reduce((acc, m) => acc + Number(m.amount || 0), 0);

        const totalWithdrawal = (movements ?? [])
          .filter(m => String(m.type).toUpperCase() === 'WITHDRAWAL')
          .reduce((acc, m) => acc + Number(m.amount || 0), 0);

        this.buildPdf({
          from,
          to,
          customer,
          accounts: accounts ?? [],
          movements: movements ?? [],
          totalDeposit,
          totalWithdrawal,
        });
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el reporte' });
      }
    });
  }

 private buildPdf(data: {
  from: string;
  to: string;
  customer: any;
  accounts: any[];
  movements: any[];
  totalDeposit: number;
  totalWithdrawal: number;
}): void {

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  let y = 18;

  const customerName =
    data.customer?.fullName ??
    data.customer?.name ??
    '-';

  /* ===== TÍTULO ===== */
  doc.setFontSize(18);
  doc.text('Estado de Cuenta del Cliente', marginX, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Cliente: ${customerName}`, marginX, y); y += 6;
  doc.text(`ID Cliente: ${this.customerId}`, marginX, y); y += 6;
  doc.text(`Período: ${data.from} a ${data.to}`, marginX, y); y += 10;

  doc.setDrawColor(220);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  /* ===== RESUMEN ===== */
  doc.setFontSize(12);
  doc.text('Resumen', marginX, y);
  y += 7;

  doc.setFontSize(11);
  doc.text(`Total Depósitos: ${this.money(data.totalDeposit)}`, marginX, y); y += 6;
  doc.text(`Total Retiros: ${this.money(data.totalWithdrawal)}`, marginX, y); y += 10;

  /* ===== CUENTAS ===== */
  doc.setFontSize(12);
  doc.text('Cuentas', marginX, y);
  y += 8;

  y = this.tableHeader(doc, y, ['N° Cuenta', 'Tipo', 'Saldo']);

  if (!data.accounts.length) {
    doc.setFontSize(11);
    doc.text('No existen cuentas para este cliente.', marginX, y);
    y += 10;
  } else {
    for (const a of data.accounts) {
      if (y > 275) {
        doc.addPage();
        y = 18;
        y = this.tableHeader(doc, y, ['N° Cuenta', 'Tipo', 'Saldo']);
      }

      y = this.tableRow(doc, y, [
        String(a.accountNumber ?? '-'),
        String(a.type ?? '-'),
        this.money(a.balance),
      ]);
    }
    y += 6;
  }

  /* ===== MOVIMIENTOS ===== */
  doc.setFontSize(12);
  doc.text('Movimientos (en el período)', marginX, y);
  y += 8;

  y = this.tableHeader(doc, y, ['Fecha', 'Tipo', 'Monto']);

  const movs = [...(data.movements ?? [])]
    .sort((a, b) => String(a.movementDate).localeCompare(String(b.movementDate)));

  if (!movs.length) {
    doc.setFontSize(11);
    doc.text('No existen movimientos en este período.', marginX, y);
    y += 8;
  } else {
    for (const m of movs) {
      if (y > 275) {
        doc.addPage();
        y = 18;
        y = this.tableHeader(doc, y, ['Fecha', 'Tipo', 'Monto']);
      }

      y = this.tableRow(doc, y, [
        String(m.movementDate ?? '-'),
        this.translateMovementType(m.type),
        this.money(m.amount),
      ]);
    }
  }

  /* ===== FOOTER ===== */
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Generado por BANCO', marginX, 290);
  doc.setTextColor(0);

  doc.save(`estado-cuenta-${this.customerId}-${data.from}-${data.to}.pdf`);
}


  private toIsoDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private money(value: any): string {
    const n = Number(value);
    if (Number.isNaN(n)) return '-';
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  private translateMovementType(type: string): string {
  switch (type) {
    case 'DEPOSIT':
      return 'DEPÓSITO';
    case 'WITHDRAWAL':
      return 'RETIRO';
    default:
      return type;
  }
}


  private tableHeader(doc: jsPDF, y: number, headers: string[]): number {
    const x = 14;
    const col1 = x;
    const col2 = 90;
    const col3 = 150;

    doc.setFontSize(10);
    doc.setTextColor(60);

    doc.text(headers[0], col1, y);
    doc.text(headers[1], col2, y);
    doc.text(headers[2], col3, y);

    y += 4;
    doc.setDrawColor(200);
    doc.line(x, y, 196, y);
    y += 6;

    doc.setTextColor(0);
    return y;
  }

  private tableRow(doc: jsPDF, y: number, cols: string[]): number {
    const x = 14;
    const col1 = x;
    const col2 = 90;
    const col3 = 150;

    doc.setFontSize(10);

    doc.text(cols[0], col1, y);
    doc.text(cols[1], col2, y);
    doc.text(cols[2], col3, y);

    y += 6;
    doc.setDrawColor(235);
    doc.line(x, y, 196, y);
    y += 6;

    return y;
  }
}
