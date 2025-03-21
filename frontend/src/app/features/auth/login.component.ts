import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <h2>Connexion</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Email</label>
      <input type="email" formControlName="email" />
      <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email invalide</div>

      <label>Mot de passe</label>
      <input type="password" formControlName="password" />
      <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Mot de passe requis</div>

      <button type="submit" [disabled]="form.invalid">Se connecter</button>
    </form>
    
    <a routerLink="/forgot-password">Mot de passe oublié ?</a>
    <a routerLink="/register">Créer un compte</a>
  `
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.http.post<{ token: string }>('http://localhost:8080/auth/login', this.form.value).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => alert('Erreur de connexion'),
    });
  }
}
