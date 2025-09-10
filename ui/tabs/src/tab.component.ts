/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  ContentChild,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { BriTabContentDirective } from './tab-content.directive';
import { BRI_TAB, BriTabLabelDirective } from './tab-label.directive';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const BRI_TAB_GROUP = new InjectionToken<any>('BRI_TAB_GROUP');

@Component({
  selector: 'bri-tab',
  // Note that usually we'd go through a bit more trouble and set up another class so that
  // the inlined template of `BriTab` isn't duplicated, however the template is small enough
  // that creating the extra class will generate more code than just duplicating the template.
  templateUrl: './tab.component.html',
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'briTab',
  providers: [{ provide: BRI_TAB, useExisting: BriTabComponent }],
  standalone: true,
  host: {
    // This element will be rendered on the server in order to support hydration.
    // Hide it so it doesn't cause a layout shift when it's removed on the client.
    hidden: '',
  },
})
export class BriTabComponent implements OnInit, OnChanges, OnDestroy {
  /** whether the tab is disabled. */
  @Input({ transform: booleanAttribute })
  disabled = false;

  /** Content for the tab label given by `<ng-template bri-tab-label>`. */
  @ContentChild(BriTabLabelDirective)
  get templateLabel(): BriTabLabelDirective {
    return this._templateLabel;
  }

  set templateLabel(value: BriTabLabelDirective) {
    this._setTemplateLabelInput(value);
  }

  private _templateLabel!: BriTabLabelDirective;

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(BriTabContentDirective, { read: TemplateRef, static: true })
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  private _explicitContent: TemplateRef<any> = undefined!;

  /** Template inside the BriTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, { static: true }) _implicitContent!: TemplateRef<any>;

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel = '';

  /** Aria label for the tab. */
  @Input('aria-label') ariaLabel!: string;

  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  @Input('aria-labelledby') ariaLabelledby!: string;

  /**
   * Classes to be passed to the tab label inside the bri-tab-header container.
   * Supports string and string array values, same as `ngClass`.
   */
  @Input() labelClass!: string | string[];

  /**
   * Classes to be passed to the tab bri-tab-body container.
   * Supports string and string array values, same as `ngClass`.
   */
  @Input() bodyClass!: string | string[];

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  /** @docs-private */
  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  /**
   * The relatively indexed position where 0 represents the center, negative is left, and positive
   * represents the right.
   */
  position: number | null = null;

  /**
   * The initial relatively index origin of the tab if it was created and selected after there
   * was already a selected tab. Provides context of what position the tab should originate from.
   */
  origin: number | null = null;

  /**
   * Whether the tab is currently active.
   */
  isActive = false;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    @Inject(BRI_TAB_GROUP) @Optional() public _closestTabGroup: any
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textLabel'] || changes['disabled']) {
      this._stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(
      this._explicitContent || this._implicitContent,
      this._viewContainerRef
    );
  }

  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  private _setTemplateLabelInput(value: BriTabLabelDirective | undefined) {
    // Only update the label if the query managed to find one. This works around an issue where a
    // user may have manually set `templateLabel` during creation mode, which would then get
    // clobbered by `undefined` when the query resolves. Also note that we check that the closest
    // tab matches the current one so that we don't pick up labels from nested tabs.
    if (value && value._closestTab === this) {
      this._templateLabel = value;
    }
  }
}
