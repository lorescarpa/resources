/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CdkStep, STEPPER_GLOBAL_OPTIONS, StepperOptions } from '@angular/cdk/stepper';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  Inject,
  Optional,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { BriStepperComponent } from './stepper.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap } from 'rxjs';
import { BriStepContentDirective } from './step-content.directive';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

@Component({
  standalone: true,
  selector: 'bri-step',
  templateUrl: './step.component.html',
  host: {
    hidden: '', // Hide the steps so they don't affect the layout.
  },
  imports: [CdkPortalOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriStepComponent extends CdkStep implements AfterContentInit {
  private _destroyRef = inject(DestroyRef);

  /** Currently-attached portal containing the lazy content. */
  _portal!: TemplatePortal;

  /** Content that will be rendered lazily. */
  @ContentChild(BriStepContentDirective, { static: false })
  _lazyContent!: BriStepContentDirective;

  constructor(
    @Inject(forwardRef(() => BriStepperComponent)) stepper: BriStepperComponent,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) stepperOptions?: StepperOptions
  ) {
    super(stepper, stepperOptions);
  }

  ngAfterContentInit() {
    this._stepper.steps.changes
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        switchMap(() => {
          return this._stepper.selectionChange.pipe(
            map((event) => event.selectedStep === this),
            startWith(this._stepper.selected === this)
          );
        })
      )
      .subscribe((isSelected) => {
        if (isSelected && this._lazyContent && !this._portal) {
          this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef!);
        }
      });
  }
}
