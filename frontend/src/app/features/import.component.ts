import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-import',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    template: `
    <h2>Importer un fichier CSV</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="file" accept=".csv" (change)="onFileSelected($event)" />
      <div *ngIf="form.get('file')?.invalid && form.get('file')?.touched">Fichier requis</div>

      <button type="submit" [disabled]="form.invalid || isLoading">Importer</button>
    </form>

    <p *ngIf="success" style="color: green;">Import réussi !</p>
    <p *ngIf="error" style="color: red;">Erreur lors de l’import.</p>
  `
})
export class ImportComponent {
  form: FormGroup<{ file: FormControl<File | null> }> = this.fb.group({
    file: this.fb.control<File | null>(null, Validators.required),
  });

  isLoading = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.form.controls.file.setValue(file);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const file = this.form.controls.file.value;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isLoading = true;
    this.success = false;
    this.error = false;

    this.http.post('http://localhost:8080/transactions/import', formData).subscribe({
      next: () => {
        this.success = true;
        this.form.reset();
        setTimeout(() => this.router.navigateByUrl('/transactions'), 1000);
      },
      error: () => {
        this.error = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
