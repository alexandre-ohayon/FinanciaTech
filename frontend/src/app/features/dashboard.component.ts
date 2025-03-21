import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';
import { Transaction } from './transactions.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, NgxChartsModule, RouterModule],
  template: `
    <h2>Dashboard</h2>

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');  // Récupère le token JWT stocké dans localStorage
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<Transaction[]>('http://localhost:8080/transactions', { headers }).subscribe({
      next: (data) => {
        this.transactions = data;
        this.prepareChartData();
      },
      error: () => alert('Erreur lors du chargement des transactions'),
    });
  }

  prepareChartData() {
    const categoryData = this.transactions.reduce((acc, tx) => {
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
