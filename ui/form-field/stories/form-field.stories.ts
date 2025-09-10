import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { BriInputModule } from '@wkp/bricks/input';
import { BriFormFieldModule } from './../src';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  template: `<div style="display: flex; flex-direction: row; gap: 10px">
    <bri-form-field style="width: 200px">
      <bri-label>Default</bri-label>
      <input briInput placeholder="placeholder" />
      <span briTextSuffix>test</span>
    </bri-form-field>

    <bri-form-field style="width: 200px">
      <bri-label>Disabled</bri-label>
      <input briInput placeholder="placeholder" disabled />
      <span briTextSuffix>test</span>
    </bri-form-field>

    <bri-form-field style="width: 200px">
      <bri-label>Error</bri-label>
      <input briInput placeholder="Second input" [formControl]="control" />
      <bri-hint>Hint</bri-hint>
      <bri-error>Error</bri-error>
    </bri-form-field>
  </div>`,
  imports: [BriFormFieldModule, BriInputModule, ReactiveFormsModule],
  standalone: true,
})
class DummyComponent {
  control = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(2),
  ]);
}

const meta: Meta<DummyComponent> = {
  title: 'Form Field',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
