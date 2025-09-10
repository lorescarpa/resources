/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const BriTooltipAnimations: {
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: trigger('transformPanel', [
    state(
      'void',
      style({
        opacity: 0,
      })
    ),
    transition(
      'void => showing',
      animate(
        '250ms cubic-bezier(0, 0, 0.2, 1)',
        style({
          opacity: 1,
        })
      )
    ),
    transition(
      '* => void',
      animate('250ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 }))
    ),
  ]),
};
