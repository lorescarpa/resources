/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Inject,
  Optional,
  InjectionToken,
  booleanAttribute,
} from '@angular/core';
import {
  BriOptionParentComponent,
  BRI_OPTION_PARENT_COMPONENT,
} from './option-parent';

// Notes on the accessibility pattern used for `bri-optgroup`.
// The option group has two different "modes": regular and inert. The regular mode uses the
// recommended a11y pattern which has `role="group"` on the group element with `aria-labelledby`
// pointing to the label. This works for `bri-select`, but it seems to hit a bug for autocomplete
// under VoiceOver where the group doesn't get read out at all. The bug appears to be that if
// there's __any__ a11y-related attribute on the group (e.g. `role` or `aria-labelledby`),
// VoiceOver on Safari won't read it out.
// We've introduced the `inert` mode as a workaround. Under this mode, all a11y attributes are
// removed from the group, and we get the screen reader to read out the group label by mirroring it
// inside an invisible element in the option. This is sub-optimal, because the screen reader will
// repeat the group label on each navigation, whereas the default pattern only reads the group when
// the user enters a new group. The following alternate approaches were considered:
// 1. Reading out the group label using the `LiveAnnouncer` solves the problem, but we can't control
//    when the text will be read out so sometimes it comes in too late or never if the user
//    navigates quickly.
// 2. `<bri-option aria-describedby="groupLabel"` - This works on Safari, but VoiceOver in Chrome
//    won't read out the description at all.
// 3. `<bri-option aria-labelledby="optionLabel groupLabel"` - This works on Chrome, but Safari
//     doesn't read out the text at all. Furthermore, on

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `BriOptgroup`. It serves as
 * alternative token to the actual `BriOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const BRI_OPTION_GROUP = new InjectionToken<BriOptionGroupComponent>(
  'BriOptionGroup'
);

/**
 * Component that is used to group instances of `bri-option`.
 */
@Component({
  standalone: true,
  selector: 'bri-option-group',
  exportAs: 'briOptionGroup',
  templateUrl: './option-group.component.html',
  styleUrl: './option-group.component.scss',
  host: {
    class: 'bri-option-group',
    '[attr.role]': '_inert ? null : "group"',
    '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
    '[attr.aria-labelledby]': '_inert ? null : _labelId',
  },
  providers: [
    { provide: BRI_OPTION_GROUP, useExisting: BriOptionGroupComponent },
  ],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriOptionGroupComponent {
  /** Label for the option group. */
  @Input() label!: string;

  /** whether the option group is disabled. */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Unique id for the underlying label. */
  _labelId = `bri-optgroup-label-${_uniqueOptgroupIdCounter++}`;

  /** Whether the group is in inert a11y mode. */
  _inert: boolean;

  constructor(
    @Inject(BRI_OPTION_PARENT_COMPONENT)
    @Optional()
    parent?: BriOptionParentComponent
  ) {
    this._inert = parent?.inertGroups ?? false;
  }
}
