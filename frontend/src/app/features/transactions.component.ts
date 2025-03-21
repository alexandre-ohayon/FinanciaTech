import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  template: `
    <h2>Transactions</h2>

    <table *ngIf="transactions.length > 0">
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
          <td [style.color]="tx.amount < 0 ? 'red' : 'green'">{{ tx.amount | currency:'EUR' }}</td>
          <td>{{ tx.category || '-' }}</td>
          <td>
            <button (click)="editTransaction(tx)">Modifier</button>
            <button (click)="deleteTransaction(tx.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="transactions.length === 0">
      <p>Aucune transaction trouvée.</p>
    </div>

    <h2>Ajouter une transaction</h2>
    <form (submit)="addTransaction()">
      <label for="label">Libellé</label>
      <input type="text" id="label" [(ngModel)]="newTransaction.label" name="label" required />

      <label for="amount">Montant</label>
      <input type="number" id="amount" [(ngModel)]="newTransaction.amount" name="amount" required />

      <label for="category">Catégorie</label>
      <input type="text" id="category" [(ngModel)]="newTransaction.category" name="category" />

      <label for="date">Date</label>
      <input type="date" id="date" [(ngModel)]="newTransaction.date" name="date" required />

      <button type="submit">Ajouter</button>
    </form>
  `,
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
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Transaction[]>('http://localhost:8080/transactions', { headers }).subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: () => alert('Erreur lors du chargement des transactions'),
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
      error: () => alert('Erreur lors de l\'ajout de la transaction'),
    });
  }

  deleteTransaction(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`http://localhost:8080/transactions/${id}`, { headers }).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(tx => tx.id !== id);
        },
        error: () => alert('Erreur lors de la suppression de la transaction'),
      });
    }
  }

  editTransaction(tx: Transaction) {
    this.router.navigate([`/transactions/edit/${tx.id}`]);
  }
}