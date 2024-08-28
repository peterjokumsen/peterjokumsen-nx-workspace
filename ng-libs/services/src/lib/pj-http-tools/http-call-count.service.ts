import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpCallCountService {
  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  increment() {
    this._count.next(this._count.value + 1);
  }

  decrement() {
    if (this._count.value === 0) return;
    this._count.next(this._count.value - 1);
  }
}
