/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { BriNotificationRef } from './notification-ref';
import { BRI_NOTIFICATION_DATA } from './notification-config';

/**
 * Interface for a simple notification component that has a message and a single action.
 */

export type TextOnlyNotificationDataType = 'informative' | 'urgent';

export type TextOnlyNotificationData = {
  type: TextOnlyNotificationDataType;
  title: string;
  message: string;
  action: string;
};

export interface TextOnlyNotification {
  data: TextOnlyNotificationData;
  notificationRef: BriNotificationRef<TextOnlyNotification>;
  action: () => void;
  hasAction: boolean;
}

@Component({
  selector: 'bri-simple-notification',
  templateUrl: './simple-notification.component.html',
  styleUrl: './simple-notification.component.scss',
  exportAs: 'briNotification',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'bri-simple-notification bri-simple-notification-urgent',
  },
})
export class BriSimpleNotificationComponent implements TextOnlyNotification {
  constructor(
    public notificationRef: BriNotificationRef<BriSimpleNotificationComponent>,
    @Inject(BRI_NOTIFICATION_DATA)
    public data: TextOnlyNotificationData
  ) {}

  /** Performs the action on the notification. */
  action(): void {
    this.notificationRef.dismissWithAction();
  }

  /** If the action button should be shown. */
  get hasAction(): boolean {
    return !!this.data.action;
  }
}
