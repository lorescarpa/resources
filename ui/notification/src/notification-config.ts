/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ViewContainerRef, InjectionToken } from '@angular/core';
import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';

/** Injection token that can be used to access the data that was passed in to a notification. */
export const BRI_NOTIFICATION_DATA = new InjectionToken<any>(
  'BriNotificationData'
);

/** Possible values for horizontalPosition on BriNotificationConfig. */
export type BriNotificationHorizontalPosition =
  | 'start'
  | 'center'
  | 'end'
  | 'left'
  | 'right';

/** Possible values for verticalPosition on BriNotificationConfig. */
export type BriNotificationVerticalPosition = 'top' | 'bottom';

/**
 * Configuration used when opening a notification.
 */
export class BriNotificationConfig<D = any> {
  /** The politeness level for the BriAriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /**
   * Message to be announced by the LiveAnnouncer. When opening a notification without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage?: string = '';

  /**
   * The view container that serves as the parent for the notification for the purposes of dependency
   * injection. Note: this does not affect where the notification is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;

  /** The length of time in milliseconds to wait before automatically dismissing the notification. */
  duration?: number = 0;

  /** Extra CSS classes to be added to the notification container. */
  panelClass?: string | string[];

  /** Text layout direction for the notification. */
  direction?: Direction;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** The horizontal position to place the notification. */
  horizontalPosition?: BriNotificationHorizontalPosition = 'center';

  /** The vertical position to place the notification. */
  verticalPosition?: BriNotificationVerticalPosition = 'bottom';
}
