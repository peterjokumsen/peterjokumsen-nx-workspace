import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function slideInAnimation(
  triggerName: string,
): ReturnType<typeof trigger> {
  return trigger(triggerName, [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ],
        { optional: true },
      ),
      query(':enter', [style({ left: '-100%' })], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(
          ':leave',
          [animate('400ms ease-out', style({ left: '100%', opacity: 0 }))],
          { optional: true },
        ),
        query(':enter', [animate('500ms ease-out', style({ left: '0%' }))], {
          optional: true,
        }),
        query('@*', animateChild(), { optional: true }),
      ]),
    ]),
  ]);
}
