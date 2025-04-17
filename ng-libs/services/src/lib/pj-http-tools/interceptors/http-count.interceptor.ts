import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HttpCallCountService } from '../';

export const httpCountInterceptor: HttpInterceptorFn = (req, next) => {
  const counter = inject(HttpCallCountService);
  counter.increment();
  return next(req).pipe(finalize(() => counter.decrement()));
};
