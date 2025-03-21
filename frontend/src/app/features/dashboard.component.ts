import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';
import { Transaction } from './transactions.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MatButtonModule } from '@angular/material/button'; // Import material button
import { MatTableModule } from '@angular/material/table'; // Import material table
import { MatFormFieldModule } from '@angular/material/form-field'; // Import form fields
import { MatInputModule } from '@angular/material/input'; // Import input fields
import { MatToolbarModule } from '@angular/material/toolbar';  // Pour la barre de navigation
import { MatListModule } from '@angular/material/list';  // Pour la barre de navigation
import { MatSidenavModule } from '@angular/material/sidenav';  // Pour la barre de navigation

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, NgxChartsModule, RouterModule, FormsModule, MatButtonModule, MatSidenavModule,
    MatListModule,
    MatToolbarModule, 
    MatTableModule,
    MatFormFieldModule,
    MatInputModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">Dashboard</a>
          <a mat-list-item routerLink="/transactions">Transactions</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <h2>Dashboard</h2>

        <form (submit)="applyFilters()">
          <mat-form-field appearance="fill">
            <mat-label>Start Date</mat-label>
            <input matInput type="date" [(ngModel)]="startDate" name="startDate" />
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>End Date</mat-label>
            <input matInput type="date" [(ngModel)]="endDate" name="endDate" />
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Category</mat-label>
            <input matInput type="text" [(ngModel)]="categoryFilter" name="categoryFilter" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Apply Filters</button>
        </form>

        <!-- Graphique des revenus vs dépenses -->
        <div *ngIf="revenueData.length > 0 && expenseData.length > 0">
          <ngx-charts-bar-vertical
            [results]="revenueExpenseData"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            [showDataLabel]="true"
            [roundEdges]="true">
          </ngx-charts-bar-vertical>
        </div>

        <!-- Graphique mensuel -->
        <div *ngIf="monthlyChartData.length > 0">
          <ngx-charts-line-chart
            [results]="monthlyChartData"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            >
          </ngx-charts-line-chart>
        </div>

        <!-- Graphique des catégories -->
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
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class DashboardComponent implements OnInit {
  barChartData: { name: string; value: number }[] = [];
  monthlyChartData: { name: string; series: { name: string; value: number }[] }[] = [];
  revenueData: { name: string; value: number }[] = [];
  expenseData: { name: string; value: number }[] = [];

  revenueExpenseData: { name: string; value: number }[] = [];

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
        this.prepareRevenueExpenseData();
        this.prepareMonthlyChartData();
      },
      error: () => alert('Error loading transactions'),
    });
  }

  applyFilters() {
    this.prepareChartData();
    this.prepareRevenueExpenseData();
    this.prepareMonthlyChartData();
  }

  prepareMonthlyChartData() {
    const monthlyData = this.transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);
  
    this.monthlyChartData = Object.keys(monthlyData).map((month) => ({
      name: month,
      series: [
        { name: month, value: monthlyData[month] },
      ],
    }));
  
    console.log('Monthly Chart Data:', this.monthlyChartData);  // Ajoute ce log
  }

  prepareChartData() {
    const filteredTransactions = this.transactions.filter((tx) => {
      let valid = true;

      if (this.startDate && new Date(tx.date) < new Date(this.startDate)) valid = false;
      if (this.endDate && new Date(tx.date) > new Date(this.endDate)) valid = false;
      if (this.categoryFilter && !tx.category?.toLowerCase().includes(this.categoryFilter.toLowerCase())) valid = false;

      return valid;
    });

    const categoryData = filteredTransactions.reduce((acc, tx) => {
      const category = tx.category || 'Other';
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    this.barChartData = Object.keys(categoryData).map((category) => ({
      name: category,
      value: categoryData[category],
    }));
  }

  prepareRevenueExpenseData() {
    const revenue = this.transactions.filter(tx => tx.amount > 0);
    const expense = this.transactions.filter(tx => tx.amount < 0);
  
    const totalRevenue = revenue.reduce((acc, tx) => acc + tx.amount, 0);
    const totalExpense = expense.reduce((acc, tx) => acc + tx.amount, 0);
  
    this.revenueExpenseData = [
      { name: 'Revenus', value: totalRevenue },
      { name: 'Dépenses', value: totalExpense }
    ];
  
    console.log('Revenue vs Expense Data:', this.revenueExpenseData);  // Ajoute ce log
  }
  
}
