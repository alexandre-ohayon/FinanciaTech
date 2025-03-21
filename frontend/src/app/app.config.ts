import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component';
import { LayoutComponent } from './features/layout.component';
import { DashboardComponent } from './features/dashboard.component';
import { TransactionsComponent } from './features/transactions.component';
import { ImportComponent } from './features/import.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'import', component: ImportComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: '' }
];

export const appConfig = {
  providers: [provideRouter(routes)],
};
