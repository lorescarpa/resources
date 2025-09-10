/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import {
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import {
  BriSimpleNotificationComponent,
  TextOnlyNotification,
  TextOnlyNotificationDataType,
} from './simple-notification.component';
import { BriNotificationContainerComponent } from './notification-container.component';
import {
  BRI_NOTIFICATION_DATA,
  BriNotificationConfig,
} from './notification-config';
import { BriNotificationRef } from './notification-ref';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs/operators';

/** @docs-private */
export function BRI_NOTIFICATION_DEFAULT_OPTIONS_FACTORY(): BriNotificationConfig {
  return new BriNotificationConfig();
}

/** Injection token that can be used to specify default notification. */
export const BRI_NOTIFICATION_DEFAULT_OPTIONS =
  new InjectionToken<BriNotificationConfig>(
    'bri-notification-default-options',
    {
      providedIn: 'root',
      factory: BRI_NOTIFICATION_DEFAULT_OPTIONS_FACTORY,
    }
  );

/**
 * Service to dispatch notification messages.
 */
@Injectable({ providedIn: 'root' })
export class BriNotification implements OnDestroy {
  /**
   * Reference to the current notification in the view *at this level* (in the Angular injector tree).
   * If there is a parent notification service, all operations should delegate to that parent
   * via `_openedNotificationRef`.
   */
  private _notificationRefAtThisLevel: BriNotificationRef<any> | null = null;

  /** The component that should be rendered as the notification's simple component. */
  simpleNotificationComponent = BriSimpleNotificationComponent;

  /** The container component that attaches the provided template or component. */
  notificationContainerComponent = BriNotificationContainerComponent;

  /** The CSS class to apply for handset mode. */
  handsetCssClass = 'bri-notification-handset';

  /** Reference to the currently opened notification at *any* level. */
  get _openedNotificationRef(): BriNotificationRef<any> | null {
    const parent = this._parentNotification;
    return parent
      ? parent._openedNotificationRef
      : this._notificationRefAtThisLevel;
  }

  set _openedNotificationRef(value: BriNotificationRef<any> | null) {
    if (this._parentNotification) {
      this._parentNotification._openedNotificationRef = value;
    } else {
      this._notificationRefAtThisLevel = value;
    }
  }

  constructor(
    private _overlay: Overlay,
    private _live: LiveAnnouncer,
    private _injector: Injector,
    private _breakpointObserver: BreakpointObserver,
    @Optional() @SkipSelf() private _parentNotification: BriNotification,
    @Inject(BRI_NOTIFICATION_DEFAULT_OPTIONS)
    private _defaultConfig: BriNotificationConfig
  ) {}

  /**
   * Creates and dispatches a notification with a custom component for the content, removing any
   * currently opened notifications.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the notification.
   */
  openFromComponent<T, D = any>(
    component: ComponentType<T>,
    config?: BriNotificationConfig<D>
  ): BriNotificationRef<T> {
    return this._attach(component, config) as BriNotificationRef<T>;
  }

  /**
   * Creates and dispatches a notification with a custom template for the content, removing any
   * currently opened notifications.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the notification.
   */
  openFromTemplate(
    template: TemplateRef<any>,
    config?: BriNotificationConfig
  ): BriNotificationRef<EmbeddedViewRef<any>> {
    return this._attach(template, config);
  }

  /**
   * Opens a notification with a message and an optional action.
   * @param message The message to show in the notification.
   * @param action The label for the notification action.
   * @param config Additional configuration options for the notification.
   */
  open(
    type: TextOnlyNotificationDataType,
    title: string,
    message: string,
    action = '',
    config?: BriNotificationConfig
  ): BriNotificationRef<TextOnlyNotification> {
    const _config = { ...this._defaultConfig, ...config };

    // Since the user doesn't have access to the component, we can
    // override the data to pass in our own message and action.
    _config.data = { type, title, message, action };

    // Since the notification has `role="alert"`, we don't
    // want to announce the same message twice.
    if (_config.announcementMessage === message) {
      _config.announcementMessage = undefined;
    }

    return this.openFromComponent(this.simpleNotificationComponent, _config);
  }

  /**
   * Dismisses the currently-visible notification.
   */
  dismiss(): void {
    if (this._openedNotificationRef) {
      this._openedNotificationRef.dismiss();
    }
  }

  ngOnDestroy() {
    // Only dismiss the notification at the current level on destroy.
    if (this._notificationRefAtThisLevel) {
      this._notificationRefAtThisLevel.dismiss();
    }
  }

  /**
   * Attaches the notification container component to the overlay.
   */
  private _attachNotificationContainer(
    overlayRef: OverlayRef,
    config: BriNotificationConfig
  ): BriNotificationContainerComponent {
    const userInjector =
      config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: BriNotificationConfig, useValue: config }],
    });

    const containerPortal = new ComponentPortal(
      this.notificationContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef: ComponentRef<BriNotificationContainerComponent> =
      overlayRef.attach(containerPortal);
    containerRef.instance.notificationConfig = config;
    return containerRef.instance;
  }

  /**
   * Places a new component or a template as the content of the notification container.
   */
  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: BriNotificationConfig
  ): BriNotificationRef<T | EmbeddedViewRef<any>> {
    const config = {
      ...new BriNotificationConfig(),
      ...this._defaultConfig,
      ...userConfig,
    };
    const overlayRef = this._createOverlay(config);
    const container = this._attachNotificationContainer(overlayRef, config);
    const notificationRef = new BriNotificationRef<T | EmbeddedViewRef<any>>(
      container,
      overlayRef
    );

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null!, {
        $implicit: config.data,
        notificationRef,
      } as any);

      notificationRef.instance = container.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, notificationRef);
      const portal = new ComponentPortal(content, undefined, injector);
      const contentRef = container.attachComponentPortal<T>(portal);

      // We can't pass this via the injector, because the injector is created earlier.
      notificationRef.instance = contentRef.instance;
    }

    // Subscribe to the breakpoint observer and attach the bri-notification-handset class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width of the screen for full width notifications.
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe((state) => {
        overlayRef.overlayElement.classList.toggle(
          this.handsetCssClass,
          state.matches
        );
      });

    if (config.announcementMessage) {
      // Wait until the notification contents have been announced then deliver this message.
      container._onAnnounce.subscribe(() => {
        this._live.announce(config.announcementMessage!, config.politeness);
      });
    }

    this._animateNotification(notificationRef, config);
    this._openedNotificationRef = notificationRef;
    return this._openedNotificationRef;
  }

  /** Animates the old notification out and the new one in. */
  private _animateNotification(
    notificationRef: BriNotificationRef<any>,
    config: BriNotificationConfig
  ) {
    // When the notification is dismissed, clear the reference to it.
    notificationRef.afterDismissed().subscribe(() => {
      // Clear the notification ref if it hasn't already been replaced by a newer notification.
      if (this._openedNotificationRef == notificationRef) {
        this._openedNotificationRef = null;
      }

      if (config.announcementMessage) {
        this._live.clear();
      }
    });

    if (this._openedNotificationRef) {
      // If a notification is already in view, dismiss it and enter the
      // new notification after exit animation is complete.
      this._openedNotificationRef.afterDismissed().subscribe(() => {
        notificationRef.containerInstance.enter();
      });
      this._openedNotificationRef.dismiss();
    } else {
      // If no notification is in view, enter the new notification.
      notificationRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the notification is opened.
    if (config.duration && config.duration > 0) {
      notificationRef
        .afterOpened()
        .subscribe(() => notificationRef._dismissAfter(config.duration!));
    }
  }

  /**
   * Creates a new overlay and places it in the correct location.
   * @param config The user-specified notification config.
   */
  private _createOverlay(config: BriNotificationConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = config.direction;

    const positionStrategy = this._overlay.position().global();
    // Set horizontal position.
    const isRtl = config.direction === 'rtl';
    const isLeft =
      config.horizontalPosition === 'left' ||
      (config.horizontalPosition === 'start' && !isRtl) ||
      (config.horizontalPosition === 'end' && isRtl);
    const isRight = !isLeft && config.horizontalPosition !== 'center';
    if (isLeft) {
      positionStrategy.left('0');
    } else if (isRight) {
      positionStrategy.right('0');
    } else {
      positionStrategy.centerHorizontally();
    }
    // Set horizontal position.
    if (config.verticalPosition === 'top') {
      positionStrategy.top('0');
    } else {
      positionStrategy.bottom('0');
    }

    overlayConfig.positionStrategy = positionStrategy;
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an injector to be used inside of a notification component.
   * @param config Config that was used to create the notification.
   * @param notificationRef Reference to the notification.
   */
  private _createInjector<T>(
    config: BriNotificationConfig,
    notificationRef: BriNotificationRef<T>
  ): Injector {
    const userInjector =
      config && config.viewContainerRef && config.viewContainerRef.injector;

    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        { provide: BriNotificationRef, useValue: notificationRef },
        { provide: BRI_NOTIFICATION_DATA, useValue: config.data },
      ],
    });
  }
}
