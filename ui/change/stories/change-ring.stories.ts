import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriChangeRingDirective, BriChangeRingItemDirective } from '../src';

@Component({
  template: `<div [briChangeRing]="items()">
    <div [briChangeRingItem]="['first', 'third']" briChangeRingItemOffset="5">
      test
    </div>
  </div>`,
  styleUrls: ['./../src/change-ring-item.component.scss'],
})
class DummyComponent {
  items = signal<string[]>([]);

  constructor() {
    setTimeout(() => {
      this.items.set(['first', 'second']);
    }, 3000);

    setTimeout(() => {
      this.items.set([]);
    }, 6000);

    setTimeout(() => {
      this.items.set(['first', 'second']);
    }, 9000);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Change',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriChangeRingDirective, BriChangeRingItemDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
