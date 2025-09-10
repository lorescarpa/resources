/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { BriNotificationContainerComponent } from './notification-container.component';

/** Event that is emitted when a notification is dismissed. */
export interface BriNotificationDismiss {
  /** Whether the notification was dismissed using the action button. */
  dismissedByAction: boolean;
}

/** Maximum amount of milliseconds that can be passed into setTimeout. */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;

/**
 * Reference to a notification dispatched from the notification service.
 */
export class BriNotificationRef<T> {
  /** The instance of the component making up the content of the notification. */
  instance!: T;

  /**
   * The instance of the component making up the content of the notification.
   * @docs-private
   */
  containerInstance: BriNotificationContainerComponent;

  /** Subject for notifying the user that the notification has been dismissed. */
  private readonly _afterDismissed = new Subject<BriNotificationDismiss>();

  /** Subject for notifying the user that the notification has opened and appeared. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the notification action was called. */
  private readonly _onAction = new Subject<void>();

  /**
   * Timeout ID for the duration setTimeout call. Used to clear the timeout if the notification is
   * dismissed before the duration passes.
   */
  private _durationTimeoutId!: number;

  /** Whether the notification was dismissed using the action button. */
  private _dismissedByAction = false;

  constructor(
    containerInstance: BriNotificationContainerComponent,
    private _overlayRef: OverlayRef
  ) {
    this.containerInstance = containerInstance;
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }

  /** Dismisses the notification. */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }

  /** Marks the notification action clicked. */
  dismissWithAction(): void {
    if (!this._onAction.closed) {
      this._dismissedByAction = true;
      this._onAction.next();
      this._onAction.complete();
      this.dismiss();
    }
    clearTimeout(this._durationTimeoutId);
  }

  /** Dismisses the notification after some duration */
  _dismissAfter(duration: number): void {
    // Note that we need to cap the duration to the maximum value for setTimeout, because
    // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
    this._durationTimeoutId = window.setTimeout(
      () => this.dismiss(),
      Math.min(duration, MAX_TIMEOUT)
    );
  }

  /** Marks the notification as opened */
  _open(): void {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  /** Cleans up the DOM after closing. */
  private _finishDismiss(): void {
    this._overlayRef.dispose();

    if (!this._onAction.closed) {
      this._onAction.complete();
    }

    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }

  /** Gets an observable that is notified when the notification is finished closing. */
  afterDismissed(): Observable<BriNotificationDismiss> {
    return this._afterDismissed;
  }

  /** Gets an observable that is notified when the notification has opened and appeared. */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  /** Gets an observable that is notified when the notification action is called. */
  onAction(): Observable<void> {
    return this._onAction;
  }
}
