import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Transaction } from './transactions.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-edit-transaction',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2>Modifier une transaction</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Libellé</label>
      <input type="text" formControlName="label" />

      <label>Montant</label>
      <input type="number" formControlName="amount" />

      <label>Catégorie</label>
      <input type="text" formControlName="category" />

      <label>Date</label>
      <input type="date" formControlName="date" />

      <button type="submit" [disabled]="form.invalid">Modifier</button>
    </form>
  `,
})
export class EditTransactionComponent implements OnInit {
  form: FormGroup;
  transactionId: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      label: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      date: ['', Validators.required],
    });

    this.transactionId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.http.get<Transaction>(`http://localhost:8080/transactions/${this.transactionId}`).subscribe({
      next: (tx) => {
        this.form.patchValue(tx);
      },
      error: () => alert('Erreur lors du chargement de la transaction'),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.http.put<Transaction>(`http://localhost:8080/transactions/${this.transactionId}`, this.form.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/transactions');
      },
      error: () => alert('Erreur lors de la mise à jour de la transaction'),
    });
  }
}
