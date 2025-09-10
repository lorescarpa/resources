/* eslint-disable @typescript-eslint/ban-types */
import {
  CdkPortalOutlet,
  ComponentPortal,
  Portal,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  BriTooltipContent,
  BriTooltipPosition,
  BriTooltipDirection,
} from './interfaces';
import { BriTooltipAnimations } from './tooltip.animations';

@Component({
  standalone: true,
  selector: 'bri-tooltip',
  template: `
    <div class="bri-tooltip-content" [@transformPanel]="'showing'">
      <ng-template [cdkPortalOutlet]="tooltipContentPortal"></ng-template>
    </div>
    <ng-template #stringTemplate let-content>{{ content }}</ng-template>
  `,
  styleUrls: ['./tooltip.component.scss'],
  host: {
    class: 'bri-tooltip',
    '[class.bri-tooltip-below]': 'position === "below"',
    '[class.bri-tooltip-above]': 'position === "above"',
    '[class.bri-tooltip-left]': 'direction === "left"',
    '[class.bri-tooltip-right]': 'direction === "right"',
  },
  imports: [CdkPortalOutlet],
  animations: [BriTooltipAnimations.transformPanel],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriTooltipComponent implements AfterViewInit {
  _isStringContent = true;
  tooltipContentPortal: Portal<any> | undefined;

  @Input() position: BriTooltipPosition = 'above';

  @Input() direction: BriTooltipDirection = 'right';

  @Input() content: BriTooltipContent | undefined;

  @Input() get context() {
    return this._context;
  }

  set context(value: {} | undefined) {
    this._context = value;
  }

  private _context: {} | undefined;

  @ViewChild(CdkPortalOutlet, { static: false }) portalOutlet:
    | CdkPortalOutlet
    | undefined;
  @ViewChild('stringTemplate', { static: false })
  stringTemplate!: TemplateRef<any>;

  constructor(
    private _changeDetectoRef: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    if (this.content instanceof TemplateRef) {
      this.tooltipContentPortal = new TemplatePortal(
        this.content,
        this._viewContainerRef,
        { $implicit: this.context }
      );
    } else if (this.content instanceof Type) {
      this.tooltipContentPortal = new ComponentPortal(this.content);
    } else {
      this.tooltipContentPortal = new TemplatePortal(
        this.stringTemplate,
        this._viewContainerRef,
        { $implicit: this.content }
      );
    }

    this._changeDetectoRef.detectChanges();
  }
}
