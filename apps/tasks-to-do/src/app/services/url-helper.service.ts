import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlHelperService {
  createCompleteUrl(snapshot?: ActivatedRouteSnapshot): string {
    const origin = window?.location?.origin ?? '';
    let addition = '';
    if (snapshot) {
      addition = `/${snapshot.url.map((segment: UrlSegment) => segment.path).join('/')}`;
    }

    return `${origin}${addition}`;
  }
}
