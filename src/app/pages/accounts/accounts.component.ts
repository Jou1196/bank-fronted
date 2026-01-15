import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Account } from './models/account.model';
import { AccountService } from './services/account.service';



@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  customerId!: string;

  accounts: Account[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    if (!this.customerId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'CustomerId is missing in the route',
      });
      return;
    }
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;

    this.accountService.getByCustomer(this.customerId).subscribe({
      next: (data) => {
        this.accounts = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || err?.message || 'Could not load accounts',
        });
      },
    });
  }

  goMovements(a: Account): void {
    this.router.navigate(['/movements', a.id]);
  }

  backToCustomers(): void {
    this.router.navigate(['/customers']);
  }
}
