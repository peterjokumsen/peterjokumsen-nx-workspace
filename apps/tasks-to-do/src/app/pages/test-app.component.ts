import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UrlHelperService } from '../services/url-helper.service';

@Component({
  selector: 'ttd-test-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Testing authentication</h2>
    <p>Authenticated user:</p>
    <pre><code>{{ authedUser | async | json }}</code></pre>
    <button (click)="signOut()">Sign out</button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestAppComponent implements OnInit {
  private _urlHelper = inject(UrlHelperService);
  private _authSvc = inject(AuthService);

  authedUser = new BehaviorSubject<unknown>(null);

  async ngOnInit() {
    const user = await this._authSvc.getClientPrincipal();
    this.authedUser.next(user);
  }

  async signOut() {
    this._authSvc.signOut();
    const baseUrl = this._urlHelper.createCompleteUrl();
    window.location.href = `${baseUrl}/.auth/logout`;
  }
}
