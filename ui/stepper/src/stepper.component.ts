/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CdkStepper, StepContentPositionState } from '@angular/cdk/stepper';
import { AnimationEvent } from '@angular/animations';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { BriStepComponent } from './step.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, distinctUntilChanged } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import {
  DEFAULT_ANIMATION_DURATION,
  briStepperAnimations,
} from './stepper.animations';

@Component({
  standalone: true,
  selector: 'bri-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  host: {
    class: 'bri-stepper',
    role: 'tablist',
    '[attr.aria-orientation]': '"horizontal"',
  },
  animations: [briStepperAnimations.horizontalStepTransition],
  imports: [NgTemplateOutlet],
  providers: [{ provide: CdkStepper, useExisting: BriStepperComponent }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriStepperComponent
  extends CdkStepper
  implements AfterViewInit, AfterContentInit
{
  private _destroyRef = inject(DestroyRef);

  readonly _animationDone = new Subject<AnimationEvent>();

  override readonly steps: QueryList<BriStepComponent> =
    new QueryList<BriStepComponent>();

  @ContentChildren(BriStepComponent, { descendants: true })
  override _steps!: QueryList<BriStepComponent>;

  /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
  @Input()
  get animationDuration(): string {
    return this._animationDuration;
  }
  set animationDuration(value: string) {
    this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
  }

  private _animationDuration = '';

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> =
    new EventEmitter<void>();

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();

    this.steps.changes
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._stateChanged();
      });

    this._animationDone
      .pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged(
          (x, y) => x.fromState === y.fromState && x.toState === y.toState
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event) => {
        if ((event.toState as StepContentPositionState) === 'current') {
          this.animationDone.emit();
        }
      });
  }

  _stepIsNavigable(index: number, step: BriStepComponent): boolean {
    return step.completed || this.selectedIndex === index || !this.linear;
  }

  _getAnimationDuration() {
    if (this.animationDuration) {
      return this.animationDuration;
    }

    return DEFAULT_ANIMATION_DURATION;
  }
}
