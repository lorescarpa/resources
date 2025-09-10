/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';

import { BriSimpleNotificationComponent } from './simple-notification.component';
import { BriNotificationContainerComponent } from './notification-container.component';

import { BriNotification } from './notification';

const NOTIFICATION_DIRECTIVES = [
  BriNotificationContainerComponent,
  BriSimpleNotificationComponent,
];

@NgModule({
  imports: [OverlayModule, PortalModule, ...NOTIFICATION_DIRECTIVES],
  exports: NOTIFICATION_DIRECTIVES,
  providers: [BriNotification],
})
export class BriNotificationModule {}
