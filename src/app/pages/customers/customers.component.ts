import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Customer } from './models/customer';
import { CustomerService } from './services/customer.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  search = '';
  customers: Customer[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }
    goAccounts(c: Customer): void {
    this.router.navigate(['/accounts', c.id]);
  }
  loadCustomers(): void {
    this.loading = true;

    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.getErrorMessage(err),
        });
      },
    });
  }

  get filtered(): Customer[] {
    const s = this.search.trim().toLowerCase();
    if (!s) return this.customers;

   return this.customers.filter((c) =>
  `${c.fullName ?? ''} ${c.identification ?? ''}`.toLowerCase().includes(s)
);

  }

  goReports(c: Customer): void {
    
    this.router.navigate(['/reports'], {
      queryParams: { customerId: c.id }
    });
  }
  private getErrorMessage(err: any): string {
    
    const msg = err?.error?.message || err?.message;
    return msg ? String(msg) : 'Could not load customers';
  }
}
