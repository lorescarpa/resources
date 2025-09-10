import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  BriBreadcrumbComponent,
  BriBreadcrumbItem,
  BriBreadcrumbItemDirective,
} from '../src';

@Component({
  template: `
    <bri-breadcrumb (selected)="onSelected($event)">
      @for (item of _items; track item; let index = $index) {
      <bri-breadcrumb-item
        [label]="item.label"
        [selected]="item.id === selected()"
      />
      }
    </bri-breadcrumb>
  `,
})
class DummyComponent {
  readonly _items = [
    { id: '0', label: 'first' },
    { id: '1', label: 'second' },
    { id: '2', label: 'third' },
  ];

  selected = signal('2');

  onSelected({ id: selectedId }: BriBreadcrumbItem) {
    const selectedIndex = this._items.findIndex(({ id }) => id === selectedId);
    this.selected.set(`${selectedIndex}`);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Breadcrumb',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriBreadcrumbComponent, BriBreadcrumbItemDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
