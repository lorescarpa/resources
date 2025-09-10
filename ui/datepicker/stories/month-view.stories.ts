import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriMonthViewComponent } from '../src/month-view.component';
import {
  BriNativeDateModule,
  provideNativeDateAdapter,
} from '@wkp/bricks/core';

@Component({
  template: `<bri-month-view
    [activeDate]="activeDate"
    [selected]="selectedDate"
    (selectedChange)="selectedDate = $event"
  ></bri-month-view>`,
})
class DummyComponent {
  activeDate = new Date();
  selectedDate = new Date(2024, 4, 21);

  onSelectedChange(event: any): void {
    console.log('on selected change', event);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'DatePicker',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriMonthViewComponent, BriNativeDateModule],
      providers: [provideNativeDateAdapter()],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const MonthView: Story = {};
