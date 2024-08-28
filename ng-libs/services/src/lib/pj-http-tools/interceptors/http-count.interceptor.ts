import { HttpCallCountService } from '../';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';

export const httpCountInterceptor: HttpInterceptorFn = (req, next) => {
  const counter = inject(HttpCallCountService);
  counter.increment();
  return next(req).pipe(finalize(() => counter.decrement()));
};
