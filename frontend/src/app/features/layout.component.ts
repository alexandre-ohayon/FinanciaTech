import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <aside>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/transactions" routerLinkActive="active">Transactions</a>
          <a routerLink="/import" routerLinkActive="active">Import</a>
        </nav>
      </aside>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; }
    aside { width: 200px; background: #f5f5f5; padding: 1rem; }
    nav a { display: block; margin: 0.5rem 0; color: #333; text-decoration: none; }
    nav a.active { font-weight: bold; }
    main { flex: 1; padding: 2rem; overflow-y: auto; }
  `]
})
export class LayoutComponent {}
