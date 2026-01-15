import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Movement } from './models/movement.model';
import { MovementService } from './services/movement.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent implements OnInit {
  accountId!: string;

  movements: Movement[] = [];
  loading = false;

  movementType: 'CREDIT' | 'DEBIT' | null = null;
  amount: number | null = null;
  movementDate: Date = new Date();

  types = [
    { label: 'Crédito', value: 'CREDIT' },
    { label: 'Débito', value: 'DEBIT' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movementService: MovementService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId')!;
    this.loadMovements();
  }

  loadMovements(): void {
    this.loading = true;
    this.movementService.getByAccount(this.accountId).subscribe({
      next: (data) => {
        this.movements = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Could not load movements');
      },
    });
  }

  createMovement(): void {
    if (!this.movementType || !this.amount) {
      this.showError('All fields are required');
      return;
    }

    this.movementService
      .create({
        accountId: this.accountId,
        movementDate: this.movementDate.toISOString().substring(0, 10),
        movementType: this.movementType,
        amount: this.amount,
      })
      .subscribe({
        next: () => {
          this.showSuccess('Movement created');
          this.amount = null;
          this.movementType = null;
          this.loadMovements();
        },
        error: (err) => {
          this.showError(err?.error?.message || 'Operation failed');
        },
      });
  }

  back(): void {
    this.router.navigate(['/customers']);
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
