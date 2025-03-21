import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Ensure Router is imported
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; // Import material button
import { MatTableModule } from '@angular/material/table'; // Import material table
import { MatFormFieldModule } from '@angular/material/form-field'; // Import form fields
import { MatInputModule } from '@angular/material/input'; // Import input fields

export type Transaction = {
    id: string;
    userId: string;
    date: string;
    label: string;
    amount: number;
    category?: string;
  };  

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule
    ],
    template: `
    <h2>Transactions</h2>

    <table mat-table [dataSource]="transactions">
      <ng-container matColumnDef="date">
        <mat-header-cell *matHeaderCellDef>Date</mat-header-cell>
        <mat-cell *matCellDef="let transaction">{{ transaction.date }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="label">
        <mat-header-cell *matHeaderCellDef>Label</mat-header-cell>
        <mat-cell *matCellDef="let transaction">{{ transaction.label }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="amount">
        <mat-header-cell *matHeaderCellDef>Amount</mat-header-cell>
        <mat-cell *matCellDef="let transaction">{{ transaction.amount | currency }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="category">
        <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
        <mat-cell *matCellDef="let transaction">{{ transaction.category || '-' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
        <mat-cell *matCellDef="let transaction">
          <button mat-button color="accent" (click)="editTransaction(transaction)">Edit</button>
          <button mat-button color="warn" (click)="deleteTransaction(transaction.id)">Delete</button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </table>

    <form (submit)="addTransaction()">
  <mat-form-field appearance="fill">
    <mat-label>Date</mat-label>
    <input matInput type="date" [(ngModel)]="newTransaction.date" name="date" required />
  </mat-form-field>

  <mat-form-field appearance="fill">
    <mat-label>Libellé</mat-label>
    <input matInput type="text" [(ngModel)]="newTransaction.label" name="label" required />
  </mat-form-field>

  <mat-form-field appearance="fill">
    <mat-label>Montant</mat-label>
    <input matInput type="number" [(ngModel)]="newTransaction.amount" name="amount" required />
  </mat-form-field>

  <mat-form-field appearance="fill">
    <mat-label>Catégorie</mat-label>
    <input matInput type="text" [(ngModel)]="newTransaction.category" name="category" />
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">Ajouter</button>
</form>
  `
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  newTransaction: Transaction = { 
    id: '', // L'ID sera défini côté backend
    userId: '', // L'userId doit correspondre à l'utilisateur connecté
    label: '',
    amount: 0,
    category: '',
    date: '' 
  };
  displayedColumns: string[] = ['date', 'label', 'amount', 'category', 'actions']; 
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Transaction[]>('http://localhost:8080/transactions', { headers }).subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: () => alert('Error loading transactions'),
    });
  }

  addTransaction() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post<Transaction>('http://localhost:8080/transactions', this.newTransaction, { headers }).subscribe({
      next: (tx) => {
        this.transactions.push(tx);
        this.newTransaction = { id: '', userId: '', label: '', amount: 0, category: '', date: '' };
      },
      error: (err) => {
        console.error('Error adding transaction', err);
        alert('Erreur lors de l\'ajout de la transaction');
      },
    });
  }
  

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`http://localhost:8080/transactions/${id}`, { headers }).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(tx => tx.id !== id);
        },
        error: () => alert('Error deleting transaction'),
      });
    }
  }

  editTransaction(tx: Transaction) {
    this.router.navigate([`/transactions/edit/${tx.id}`]);
  }
}