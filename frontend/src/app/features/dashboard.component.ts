import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `<h2>Dashboard</h2><p>Bienvenue sur le dashboard.</p>`
})
export class DashboardComponent {}
