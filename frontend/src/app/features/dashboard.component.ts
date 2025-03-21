import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';
import { Transaction } from './transactions.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, NgxChartsModule, RouterModule, FormsModule],
  template: `
    <h2>Dashboard</h2>

    <form (submit)="applyFilters()">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" [(ngModel)]="startDate" name="startDate">

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" [(ngModel)]="endDate" name="endDate">

      <label for="categoryFilter">Category:</label>
      <input type="text" id="categoryFilter" [(ngModel)]="categoryFilter" name="categoryFilter">

      <button type="submit">Apply Filters</button>
    </form>

    <div *ngIf="barChartData.length > 0">
      <ngx-charts-bar-vertical
        [results]="barChartData"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [showDataLabel]="true"
        [roundEdges]="true">
      </ngx-charts-bar-vertical>
    </div>
    <div *ngIf="barChartData.length === 0">
      <p>Aucune transaction trouvée.</p>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  barChartData: { name: string; value: number }[] = [];
  transactions: Transaction[] = [];

  startDate: string = '';
  endDate: string = '';
  categoryFilter: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Transaction[]>('http://localhost:8080/transactions', { headers }).subscribe({
      next: (data) => {
        this.transactions = data;
        this.prepareChartData();
      },
      error: () => alert('Erreur lors du chargement des transactions'),
    });
  }

  applyFilters() {
    this.prepareChartData();
  }

  prepareChartData() {
    const filteredTransactions = this.transactions.filter(tx => {
      let valid = true;

      // Filter by date range
      if (this.startDate && new Date(tx.date) < new Date(this.startDate)) valid = false;
      if (this.endDate && new Date(tx.date) > new Date(this.endDate)) valid = false;

      // Filter by category
      if (this.categoryFilter && !tx.category?.toLowerCase().includes(this.categoryFilter.toLowerCase())) valid = false;

      return valid;
    });

    const categoryData = filteredTransactions.reduce((acc, tx) => {
      const category = tx.category || 'Autre';
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    this.barChartData = Object.keys(categoryData).map((category) => ({
      name: category,
      value: categoryData[category],
    }));
  }
}
