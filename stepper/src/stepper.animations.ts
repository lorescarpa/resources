/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
  group,
  query,
  animateChild,
} from '@angular/animations';

export const DEFAULT_ANIMATION_DURATION = '500ms';

export const briStepperAnimations: {
  readonly horizontalStepTransition: AnimationTriggerMetadata;
} = {
  /** Animation that transitions the step along the X axis in a horizontal stepper. */
  horizontalStepTransition: trigger('horizontalStepTransition', [
    state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
    // Transition to `inherit`, rather than `visible`,
    // because visibility on a child element the one from the parent,
    // making this element focusable inside of a `hidden` element.
    state('current', style({ transform: 'none', visibility: 'inherit' })),
    state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
    transition(
      '* => *',
      group([
        animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
        query('@*', animateChild(), { optional: true }),
      ]),
      {
        params: { animationDuration: DEFAULT_ANIMATION_DURATION },
      }
    ),
  ]),
};
