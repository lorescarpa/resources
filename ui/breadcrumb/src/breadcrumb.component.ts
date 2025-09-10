import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { BriAnchorComponent } from '@wkp/bricks/button';
import { Subject, takeUntil, tap } from 'rxjs';
import { BriBreadcrumbItemDirective } from './breadcrumb-item.directive';
import { BriBreadcrumbItem } from './types';

@Component({
  standalone: true,
  selector: 'bri-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [NgClass, BriAnchorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BriBreadcrumbComponent implements AfterContentInit, OnDestroy {
  private _destroyed$ = new Subject<void>();

  @ContentChildren(BriBreadcrumbItemDirective)
  _items!: QueryList<BriBreadcrumbItemDirective>;

  selectedItem!: BriBreadcrumbItemDirective;

  @Output() selected = new EventEmitter<BriBreadcrumbItem>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._items.changes
      .pipe(
        takeUntil(this._destroyed$),
        tap(() => this._changeDetectorRef.detectChanges())
      )
      .subscribe();
  }

  select(item: BriBreadcrumbItemDirective): void {
    this.selectedItem = item;
    this.selected.emit({ id: item.id(), label: item.label(), url: item.url() });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
