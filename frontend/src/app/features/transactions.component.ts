import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

export type Transaction = {
    id: string;
    userId: string;
    date: string;
    label: string;
    amount: number;
    category?: string;
  };
  

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule, HttpClientModule],
  template: `
    <h2>Mes transactions</h2>

    <table *ngIf="transactions.length > 0; else empty">
      <thead>
        <tr>
          <th>Date</th>
          <th>Libellé</th>
          <th>Montant</th>
          <th>Catégorie</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tx of transactions">
          <td>{{ tx.date }}</td>
          <td>{{ tx.label }}</td>
          <td [style.color]="tx.amount < 0 ? 'red' : 'green'">
            {{ tx.amount | currency:'EUR' }}
          </td>
          <td>{{ tx.category || '-' }}</td>
          <td>
            <button (click)="deleteTransaction(tx.id)">🗑️</button>
          </td>
          <td>
  <button (click)="editTransaction(tx.id)">Modifier</button>
</td>

        </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p>Aucune transaction trouvée.</p>
    </ng-template>
  `,
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.http.get<Transaction[]>('http://localhost:8080/transactions').subscribe({
      next: (data) => (this.transactions = data),
      error: () => alert('Erreur lors du chargement des transactions'),
    });
  }

  deleteTransaction(id: string) {
    if (!confirm('Supprimer cette transaction ?')) return;

    this.http.delete(`http://localhost:8080/transactions/${id}`).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(tx => tx.id !== id);
      },
      error: () => alert('Erreur lors de la suppression'),
    });
  }

  editTransaction(id: string) {
    this.router.navigate([`/transactions/edit/${id}`]);
  }

}
