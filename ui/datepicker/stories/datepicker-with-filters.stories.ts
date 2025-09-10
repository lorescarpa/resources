import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { BriInputModule } from '@wkp/bricks/input';
import { provideLuxonDateAdapter } from '@wkp/bricks/luxon-adapter';
import Holidays from 'date-holidays';
import { DateTime } from 'luxon';
import { BriDatepickerModule } from './../src';

@Component({
  template: `
    <bri-form-field>
      <bri-label>Date picker</bri-label>
      <input
        briInput
        [briDatepicker]="picker"
        [briDatepickerFilter]="filterDates"
        [min]="minDate"
        [max]="maxDate"
        [formControl]="formControl"
      />
      <bri-datepicker-toggle
        briIconSuffix
        [for]="picker"
      ></bri-datepicker-toggle>
      <bri-datepicker #picker></bri-datepicker>
    </bri-form-field>
  `,
})
class DummyComponent {
  minDate = DateTime.fromISO('2024-01-23');
  maxDate = DateTime.fromISO('2030-02-01');

  formControl = new FormControl();

  filterDates = (date: DateTime): boolean => {
    const holidays = new Holidays('DE');
    return (
      ![6, 7].includes(date?.weekday) && !holidays.isHoliday(date?.toJSDate())
    );
  };

  constructor() {
    this.formControl.valueChanges.subscribe((value) =>
      console.log('value', value)
    );
  }

  onSelectedChange(event: any): void {
    console.log('on date changed', event);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'DatePicker',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideLuxonDateAdapter()],
    }),
    moduleMetadata({
      imports: [BriDatepickerModule, BriInputModule, ReactiveFormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const WithFilters: Story = {};
