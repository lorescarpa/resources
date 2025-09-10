import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { BriIconButtonComponent } from '@wkp/bricks/button';
import { HasInitialized, mixinInitialized } from '@wkp/bricks/core';
import { BriIconModule, injectIcons } from '@wkp/bricks/icon';
import {
  arrowBackIcon,
  arrowForthIcon,
} from '@wkp/bricks/svg/navigation-and-action';

const _BriCompressedPaginatorMixinBase = mixinInitialized(class {});

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class CompressedPageEvent {
  /** The current page index. */
  pageIndex!: number;
}

@Component({
  standalone: true,
  selector: 'bri-compressed-paginator',
  templateUrl: './compressed-paginator.component.html',
  styleUrl: './compressed-paginator.component.scss',
  host: {
    role: 'group',
    class: 'bri-paginator',
    '[class.bri-paginator-not-visible]': '!hasPreviousPage() && !hasNextPage()',
  },
  imports: [BriIconButtonComponent, BriIconModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriCompressedPaginatorComponent
  extends _BriCompressedPaginatorMixinBase
  implements OnInit, HasInitialized
{
  readonly currentPage = input(0, { transform: numberAttribute });

  readonly hasPreviousPage = input(false, { transform: booleanAttribute });

  readonly hasNextPage = input(false, { transform: booleanAttribute });

  @Output()
  readonly page = new EventEmitter<CompressedPageEvent>();

  constructor() {
    super();

    injectIcons([arrowBackIcon, arrowForthIcon]);
  }

  ngOnInit(): void {
    this._markInitialized();
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.currentPage() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const nextPageIndex = this.currentPage() + 1;
    this._emitPageEvent(nextPageIndex);
  }

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(pageIndex: number) {
    this.page.emit({
      pageIndex,
    });
  }
}
