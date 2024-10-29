import { AuthService } from '../services/auth.service';
import { CanActivateFn } from '@angular/router';
import { PjLogger } from '@peterjokumsen/ng-services';
import { UrlHelperService } from '../services/url-helper.service';
import { inject } from '@angular/core';

export const hasAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const authSvc = inject(AuthService);
  const urlHelper = inject(UrlHelperService);
  const logger = inject(PjLogger, { optional: true });
  const authed = await authSvc.isAuthenticated();
  logger?.to.log({ route, state, authed });
  if (!authed) {
    const baseUrl = urlHelper.createCompleteUrl();
    window.location.href = `${baseUrl}/.auth/login/github?post_login_redirect_uri=${urlHelper.createCompleteUrl(route)}`;
  }

  return authed;
};
