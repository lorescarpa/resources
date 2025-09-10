/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  ScrollDispatcher,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Subject,
  debounceTime,
  delay,
  filter,
  fromEvent,
  merge,
  repeat,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import {
  BriTooltipContent,
  BriTooltipDirection,
  BriTooltipPosition,
} from './interfaces';
import { BriTooltipComponent } from './tooltip.component';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[briTooltip]',
  exportAs: 'briTooltip',
})
export class BriTooltipDirective implements OnInit, OnDestroy {
  private _destroyed$ = new Subject<void>();

  private _overlayRef: OverlayRef | undefined;
  private _componentRef: ComponentRef<any> | null = null;

  @Input('briTooltip') content!: BriTooltipContent;

  @Input('briTooltipPosition') position: BriTooltipPosition = 'above';

  @Input('briTooltipDirection') direction: BriTooltipDirection = 'right';

  @Input('briTooltipContext') get context() {
    return this._context;
  }

  set context(value: {} | undefined) {
    this._context = value;

    if (this._componentRef) {
      this._componentRef.instance.context = value;
    }
  }

  private _context: {} | undefined;

  constructor(
    private _elementRef: ElementRef,
    private _overlay: Overlay,
    private _scrollDispatcher: ScrollDispatcher,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    this._addListeners();
    this._elementRef.nativeElement.classList.add('bri-tooltip-trigger');
  }

  show(): void {
    const overlayRef = this._createOverlay();
    this._detach();

    const portal = new ComponentPortal(BriTooltipComponent);

    this._componentRef = overlayRef.attach(portal);
    this._componentRef.instance.position = this.position;
    this._componentRef.instance.direction = this.direction;
    this._componentRef.instance.content = this.content;
    this._componentRef.instance.context = this.context;
  }

  hide(): void {
    this._detach();
  }

  toggle(): void {
    this._componentRef ? this.hide() : this.show();
  }

  private _createOverlay(): OverlayRef {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const scrollableAncestors =
      this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);

    const positions: ConnectedPosition[] = [
      {
        originX: 'center',
        originY: this.position === 'above' ? 'top' : 'bottom',
        overlayX: this.direction === 'right' ? 'start' : 'end',
        overlayY: this.position === 'above' ? 'bottom' : 'top',
      },
    ];

    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withTransformOriginOn('.bri-tooltip')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withScrollableContainers(scrollableAncestors)
      .withPositions(positions);

    this._overlayRef = this._overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition({
        scrollThrottle: 20,
      }),
    });

    return this._overlayRef;
  }

  private _addListeners(): void {
    const element = this._elementRef.nativeElement;

    const show$ = fromEvent<MouseEvent>(element, 'mouseenter').pipe(
      filter(() => this._componentRef?.instance == null),
      delay(100),
      takeUntil(fromEvent<MouseEvent>(element, 'mouseleave')),
      repeat(),
      takeUntil(this._destroyed$)
    );

    const hide$ = fromEvent<Event>(element, 'mouseleave').pipe(
      switchMap(() =>
        fromEvent<MouseEvent>(this._document, 'mousemove').pipe(
          debounceTime(100),
          takeWhile(() => this._componentRef?.instance != null),
          filter((event) => this._isNotOnHostOrContainer(event))
        )
      ),
      takeUntil(this._destroyed$)
    );

    merge(show$, hide$)
      .pipe(
        takeUntil(this._destroyed$),
        tap(() => this.toggle())
      )
      .subscribe();
  }

  private _isNotOnHostOrContainer(event: Event): boolean {
    return !this._isOnHost(event) && !this._isOnContainer(event);
  }

  private _isOnHost({ target }: Event): boolean {
    return this._elementRef.nativeElement.contains(target as Node);
  }

  private _isOnContainer({ target }: Event): boolean {
    return (
      this._componentRef?.instance != null &&
      this._componentRef?.location.nativeElement.contains(target)
    );
  }

  private _detach(): void {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._componentRef = null;
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
