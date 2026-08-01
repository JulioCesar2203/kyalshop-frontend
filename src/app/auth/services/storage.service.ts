import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly keyToken = 'kyalshop_token';
  private readonly keyUser = 'kyalshop_user';

  saveSession(token: string, user: any): void {
    sessionStorage.setItem(this.keyToken, token);
    sessionStorage.setItem(this.keyUser, JSON.stringify(user));
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.keyToken);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.keyToken);
    sessionStorage.removeItem(this.keyUser);
  }
}
