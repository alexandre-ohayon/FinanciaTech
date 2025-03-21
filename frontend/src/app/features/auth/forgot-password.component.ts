import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2>Mot de passe oublié</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Email</label>
      <input type="email" formControlName="email" />
      <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email invalide</div>

      <button type="submit" [disabled]="form.invalid">Envoyer le lien</button>
    </form>
    <a routerLink="/login">Retour à la connexion</a>
  `,
})
export class ForgotPasswordComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8080/auth/forgot-password', this.form.value).subscribe({
      next: () => alert('Un lien de réinitialisation a été envoyé (console backend).'),
      error: () => alert('Erreur lors de l’envoi du lien.'),
    });
  }
}
