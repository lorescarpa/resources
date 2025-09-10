/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { AriaDescriber, InteractivityChecker } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  inject,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewEncapsulation,
  ANIMATION_MODULE_TYPE,
  isDevMode,
} from '@angular/core';

let nextId = 0;

/** Allowed position options for briBadgePosition */
export type BriBadgePosition =
  | 'above after'
  | 'above before'
  | 'below before'
  | 'below after'
  | 'before'
  | 'after'
  | 'above'
  | 'below';

/** Allowed size options for briBadgeSize */
export type BriBadgeSize = 'small' | 'medium' | 'large';

const BADGE_CONTENT_CLASS = 'bri-badge-content';

/** Keeps track of the apps currently containing badges. */
const badgeApps = new Set<ApplicationRef>();

/**
 * Component used to load the structural styles of the badge.
 * @docs-private
 */
@Component({
  standalone: true,
  template: '',
  styleUrl: './badge.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class _BriBadgeStyleLoaderComponent {}

/** Directive to display a text badge. */
@Directive({
  standalone: true,
  selector: '[briBadge]',
  host: {
    class: 'bri-badge',
    '[class.bri-badge-overlap]': 'overlap',
    '[class.bri-badge-above]': 'isAbove()',
    '[class.bri-badge-below]': '!isAbove()',
    '[class.bri-badge-before]': '!isAfter()',
    '[class.bri-badge-after]': 'isAfter()',
    '[class.bri-badge-small]': 'size === "small"',
    '[class.bri-badge-medium]': 'size === "medium"',
    '[class.bri-badge-large]': 'size === "large"',
    '[class.bri-badge-hidden]': 'hidden || !content',
    '[class.bri-badge-disabled]': 'disabled',
  },
})
export class BriBadgeDirective implements OnInit, OnDestroy {
  /** The color of the badge. Can be `primary` or `secondary`. */
  @Input('briBadgeColor')
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._setColor(value);
    this._color = value;
  }

  private _color = 'primary';

  /** Whether the badge should overlap its contents or not */
  @Input({ alias: 'briBadgeOverlap', transform: booleanAttribute })
  overlap = true;

  /** Whether the badge is disabled. */
  @Input({ alias: 'briBadgeDisabled', transform: booleanAttribute })
  disabled!: boolean;

  /**
   * Position the badge should reside.
   * Accepts any combination of 'above'|'below' and 'before'|'after'
   */
  @Input('briBadgePosition') position: BriBadgePosition = 'above after';

  /** The content for the badge */
  @Input('briBadge')
  get content(): string | number | undefined | null {
    return this._content;
  }
  set content(newContent: string | number | undefined | null) {
    this._updateRenderedContent(newContent);
  }
  private _content: string | number | undefined | null;

  /** Message used to describe the decorated element via aria-describedby */
  @Input('briBadgeDescription')
  get description(): string {
    return this._description;
  }
  set description(newDescription: string) {
    this._updateDescription(newDescription);
  }
  private _description!: string;

  /** Size of the badge. Can be 'small', 'medium', or 'large'. */
  @Input('briBadgeSize') size: BriBadgeSize = 'medium';

  /** Whether the badge is hidden. */
  @Input({ alias: 'briBadgeHidden', transform: booleanAttribute })
  hidden!: boolean;

  /** Unique id for the badge */
  _id: number = nextId++;

  /** Visible badge element. */
  private _badgeElement: HTMLElement | undefined;

  /** Inline badge description. Used when the badge is applied to non-interactive host elements. */
  private _inlineBadgeDescription: HTMLElement | undefined;

  /** Whether the OnInit lifecycle hook has run yet */
  private _isInitialized = false;

  /** InteractivityChecker to determine if the badge host is focusable. */
  private _interactivityChecker = inject(InteractivityChecker);

  private _document = inject(DOCUMENT);

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _ariaDescriber: AriaDescriber,
    private _renderer: Renderer2,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    const appRef = inject(ApplicationRef);

    if (!badgeApps.has(appRef)) {
      badgeApps.add(appRef);

      const componentRef = createComponent(_BriBadgeStyleLoaderComponent, {
        environmentInjector: inject(EnvironmentInjector),
      });

      appRef.onDestroy(() => {
        badgeApps.delete(appRef);
        if (badgeApps.size === 0) {
          componentRef.destroy();
        }
      });
    }

    if (isDevMode()) {
      const nativeElement = _elementRef.nativeElement;
      if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
        throw Error('briBadge must be attached to an element node.');
      }

      const briIconTagName = 'bri-icon';

      if (
        nativeElement.tagName.toLowerCase() === briIconTagName &&
        nativeElement.getAttribute('aria-hidden') === 'true'
      ) {
        console.warn(
          `Detected a briBadge on an "aria-hidden" "<bri-icon>". ` +
            `Consider setting aria-hidden="false" in order to surface the inforbriion assistive technology.` +
            `\n${nativeElement.outerHTML}`
        );
      }
    }
  }

  /** Whether the badge is above the host or not */
  isAbove(): boolean {
    return this.position.indexOf('below') === -1;
  }

  /** Whether the badge is after the host or not */
  isAfter(): boolean {
    return this.position.indexOf('before') === -1;
  }

  /**
   * Gets the element into which the badge's content is being rendered. Undefined if the element
   * hasn't been created (e.g. if the badge doesn't have content).
   */
  getBadgeElement(): HTMLElement | undefined {
    return this._badgeElement;
  }

  ngOnInit() {
    // We may have server-side rendered badge that we need to clear.
    // We need to do this in ngOnInit because the full content of the component
    // on which the badge is attached won't necessarily be in the DOM until this point.
    this._clearExistingBadges();

    if (this.content && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
      this._updateRenderedContent(this.content);
    }

    this._isInitialized = true;
  }

  ngOnDestroy() {
    // ViewEngine only: when creating a badge through the Renderer, Angular remembers its index.
    // We have to destroy it ourselves, otherwise it'll be retained in memory.
    if (this._renderer.destroyNode) {
      this._renderer.destroyNode(this._badgeElement);
      this._inlineBadgeDescription?.remove();
    }

    this._ariaDescriber.removeDescription(
      this._elementRef.nativeElement,
      this.description
    );
  }

  /** Gets whether the badge's host element is interactive. */
  private _isHostInteractive(): boolean {
    // Ignore visibility since it requires an expensive style caluclation.
    return this._interactivityChecker.isFocusable(
      this._elementRef.nativeElement,
      {
        ignoreVisibility: true,
      }
    );
  }

  /** Creates the badge element */
  private _createBadgeElement(): HTMLElement {
    const badgeElement = this._renderer.createElement('span');
    const activeClass = 'bri-badge-active';

    badgeElement.setAttribute('id', `bri-badge-content-${this._id}`);

    // The badge is aria-hidden because we don't want it to appear in the page's navigation
    // flow. Instead, we use the badge to describe the decorated element with aria-describedby.
    badgeElement.setAttribute('aria-hidden', 'true');
    badgeElement.classList.add(BADGE_CONTENT_CLASS);

    if (this._animationMode === 'NoopAnimations') {
      badgeElement.classList.add('_bri-animation-noopable');
    }

    this._elementRef.nativeElement.appendChild(badgeElement);

    // animate in after insertion
    if (
      typeof requestAnimationFrame === 'function' &&
      this._animationMode !== 'NoopAnimations'
    ) {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          badgeElement.classList.add(activeClass);
        });
      });
    } else {
      badgeElement.classList.add(activeClass);
    }

    return badgeElement;
  }

  /** Update the text content of the badge element in the DOM, creating the element if necessary. */
  private _updateRenderedContent(
    newContent: string | number | undefined | null
  ): void {
    const newContentNormalized: string = `${newContent ?? ''}`.trim();

    // Don't create the badge element if the directive isn't initialized because we want to
    // append the badge element to the *end* of the host element's content for backwards
    // compatibility.
    if (this._isInitialized && newContentNormalized && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    }

    if (this._badgeElement) {
      this._badgeElement.textContent = newContentNormalized;
    }

    this._content = newContentNormalized;
  }

  /** Updates the host element's aria description via AriaDescriber. */
  private _updateDescription(newDescription: string): void {
    // Always start by removing the aria-describedby; we will add a new one if necessary.
    this._ariaDescriber.removeDescription(
      this._elementRef.nativeElement,
      this.description
    );

    // NOTE: We only check whether the host is interactive here, which happens during
    // when then badge content changes. It is possible that the host changes
    // interactivity status separate from one of these. However, watching the interactivity
    // status of the host would require a `MutationObserver`, which is likely more code + overhead
    // than it's worth; from usages inside Google, we see that the vats majority of badges either
    // never change interactivity, or also set `briBadgeHidden` based on the same condition.

    if (!newDescription || this._isHostInteractive()) {
      this._removeInlineDescription();
    }

    this._description = newDescription;

    // We don't add `aria-describedby` for non-interactive hosts elements because we
    // instead insert the description inline.
    if (this._isHostInteractive()) {
      this._ariaDescriber.describe(
        this._elementRef.nativeElement,
        newDescription
      );
    } else {
      this._updateInlineDescription();
    }
  }

  private _updateInlineDescription() {
    // Create the inline description element if it doesn't exist
    if (!this._inlineBadgeDescription) {
      this._inlineBadgeDescription = this._document.createElement('span');
      this._inlineBadgeDescription.classList.add('cdk-visually-hidden');
    }

    this._inlineBadgeDescription.textContent = this.description;
    this._badgeElement?.appendChild(this._inlineBadgeDescription);
  }

  private _removeInlineDescription() {
    this._inlineBadgeDescription?.remove();
    this._inlineBadgeDescription = undefined;
  }

  /** Adds css theme class given the color to the component host */
  private _setColor(colorPalette: string) {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove(`bri-badge-${this._color}`);
    if (colorPalette) {
      classList.add(`bri-badge-${colorPalette}`);
    }
  }

  /** Clears any existing badges that might be left over from server-side rendering. */
  private _clearExistingBadges() {
    // Only check direct children of this host element in order to avoid deleting
    // any badges that might exist in descendant elements.
    const badges = this._elementRef.nativeElement.querySelectorAll(
      `:scope > .${BADGE_CONTENT_CLASS}`
    );
    for (const badgeElement of Array.from(badges)) {
      if (badgeElement !== this._badgeElement) {
        badgeElement.remove();
      }
    }
  }
}
