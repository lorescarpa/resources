import { Component, effect, viewChild } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  BriCompressedPaginatorComponent,
  BriPaginatorModule,
  CompressedPageEvent,
} from '../src';

@Component({
  template: `
    <bri-compressed-paginator
      currentPage="0"
      hasNextPage
      (page)="onPageChanged($event)"
    />
  `,
})
class DummyComponent {
  readonly _paginator = viewChild(BriCompressedPaginatorComponent);

  constructor() {
    effect(() => {
      this._paginator()?.initialized.subscribe(() =>
        console.log('paginator initialized')
      );
      this._paginator()?.page.subscribe(({ pageIndex }) =>
        console.log('page index', pageIndex)
      );
    });
  }
  onPageChanged(event: CompressedPageEvent): void {
    console.log('pageChanged', event.pageIndex);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Paginator',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriPaginatorModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Compressed: Story = {};
