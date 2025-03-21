import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8080';

  get token(): string | null {
    return localStorage.getItem('token');
  }

  set token(value: string | null) {
    if (value) localStorage.setItem('token', value);
    else localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
  }
}
