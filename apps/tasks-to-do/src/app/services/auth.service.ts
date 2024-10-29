import { Injectable, inject } from '@angular/core';

import { PjLogger } from '@peterjokumsen/ng-services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _logger = inject(PjLogger, { optional: true });

  private _clientPrincipal: unknown;

  private async fetchClientPrincipal(): Promise<void> {
    try {
      const response = await fetch('/.auth/me', { cache: 'no-cache' });
      const body = await response.json();
      this._clientPrincipal = body?.clientPrincipal;
    } catch (error) {
      this._logger?.to.error('Failed to fetch client principal', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this._clientPrincipal) {
      await this.fetchClientPrincipal();
    }

    this._logger?.to.log({ clientPrincipal: this._clientPrincipal });
    return !!this._clientPrincipal;
  }

  async getClientPrincipal(): Promise<unknown> {
    if (!this._clientPrincipal) {
      await this.fetchClientPrincipal();
    }

    return this._clientPrincipal;
  }

  signOut(): void {
    this._clientPrincipal = null;
  }
}
