import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  template: `
    <h2>Inscription</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Email</label>
      <input type="email" formControlName="email" />
      <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email invalide</div>

      <label>Mot de passe</label>
      <input type="password" formControlName="password" />
      <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Min 6 caractères</div>

      <button type="submit" [disabled]="form.invalid">Créer un compte</button>
    </form>
    <a routerLink="/login">Déjà inscrit ? Se connecter</a>
  `,
})
export class RegisterComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.http.post<{ token: string }>('http://localhost:8080/auth/register', this.form.value).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => alert('Erreur lors de l’inscription'),
    });
  }
}
