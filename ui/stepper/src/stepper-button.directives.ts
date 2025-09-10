import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReplaySubject, delay, filter, switchMap, take, tap } from 'rxjs';
import { BriStepperComponent } from './stepper.component';

type StepperFunction = (() => void) | string | null;

const DEFAULT_DELAY = 1000;

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  standalone: true,
  selector: 'button[briStepperNext]',
  host: {
    class: 'bri-stepper-next',
    '[type]': 'type',
    '(click)': '_execute$.next()',
  },
})
export class BriStepperNextDirective {
  _stepper = inject(BriStepperComponent);

  _execute$ = new ReplaySubject<void>();

  type = input<string>('submit');

  fn = input<StepperFunction>(null, { alias: 'briStepperNext' });

  onlyWhen = input(null, {
    alias: 'briStepperNextOnlyWhen',
    transform: booleanAttribute,
  });

  constructor() {
    const onlyWhen$ = toObservable(this.onlyWhen);

    this._execute$
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          const currentFunction = this.fn();
          if (currentFunction instanceof Function) {
            currentFunction();
          }
        }),
        delay(this.fn() ? DEFAULT_DELAY : 0),
        switchMap(() =>
          onlyWhen$.pipe(
            filter((onlyWhen) => onlyWhen == null || onlyWhen),
            tap(() => this._stepper.next()),
            take(1)
          )
        )
      )
      .subscribe();
  }
}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  standalone: true,
  selector: 'button[briStepperPrevious]',
  host: {
    class: 'bri-stepper-previous',
    '[type]': 'type',
    '(click)': '_stepper.previous()',
  },
})
export class BriStepperPreviousDirective {
  _stepper = inject(BriStepperComponent);

  type = input<string>('submit');
}
