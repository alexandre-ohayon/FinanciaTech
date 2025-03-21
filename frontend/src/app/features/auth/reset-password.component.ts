import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2>Réinitialiser le mot de passe</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Nouveau mot de passe</label>
      <input type="password" formControlName="password" />
      <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Min 6 caractères</div>

      <button type="submit" [disabled]="form.invalid">Réinitialiser</button>
    </form>
  `,
})
export class ResetPasswordComponent {
  token = this.route.snapshot.queryParamMap.get('token') || '';

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid || !this.token) return;

    this.http.post('http://localhost:8080/auth/reset-password', {
      token: this.token,
      newPassword: this.form.value.password,
    }).subscribe({
      next: () => {
        alert('Mot de passe mis à jour');
        this.router.navigateByUrl('/login');
      },
      error: () => alert('Erreur lors de la réinitialisation'),
    });
  }
}
