import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { provideNativeDateAdapter } from '@wkp/bricks/core';
import { BriCalendarComponent } from './../src/calendar.component';

@Component({
  template: `
    <bri-calendar
      [startAt]="startDate"
      [(selected)]="selected"
      [dateFilter]="dateFilter"
      [minDate]="minDate"
      [maxDate]="maxDate"
      (selectedChange)="onSelectedChange($event)"
    >
    </bri-calendar>
  `,
})
class DummyComponent {
  minDate = new Date(2020, 0, 11);
  maxDate = new Date(2030, 0, 31);

  onSelectedChange(event: any): void {
    console.log('on date changed', event);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'DatePicker',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideNativeDateAdapter()],
    }),
    moduleMetadata({ imports: [BriCalendarComponent] }),
  ],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Calendar: Story = {};
