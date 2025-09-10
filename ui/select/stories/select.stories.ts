import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { BriSelectModule } from './../src';

@Component({
  template: ` <bri-form-field style="width: 200px">
    <bri-label>Select</bri-label>
    <bri-select placeholder="test" multiple>
      @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
      <bri-option [value]="item">Item {{ item }}</bri-option>
      }
    </bri-select>
  </bri-form-field>`,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Select',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({ imports: [BriSelectModule] }),
  ],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
