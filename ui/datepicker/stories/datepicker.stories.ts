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
import { BriDatepickerModule } from './../src';

@Component({
  template: `
    <bri-form-field>
      <bri-label>Date picker</bri-label>
      <input briInput [briDatepicker]="picker" [formControl]="formControl" />
      <bri-datepicker-toggle
        briIconSuffix
        [for]="picker"
      ></bri-datepicker-toggle>
      <bri-datepicker #picker></bri-datepicker>
    </bri-form-field>
  `,
})
class DummyComponent {
  minDate = new Date(2020, 0, 11);
  maxDate = new Date(2030, 0, 31);

  formControl = new FormControl();

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

export const Primary: Story = {};
