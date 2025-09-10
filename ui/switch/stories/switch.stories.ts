import { Component, inject } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriSwitchComponent } from '../src';
import { BriLabelDirective } from '@wkp/bricks/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <div style="display: flex; align-items: center; gap: 5px;">
      <bri-switch>
        <bri-label>Default</bri-label>
      </bri-switch>
    </div>
    <div style="display: flex; align-items: center; gap: 5px;">
      <bri-switch [formControl]="_formControl">
        <bri-label>With form control {{ _formControl.value }}</bri-label>
      </bri-switch>
    </div>
    <div style="display: flex; align-items: center; gap: 5px;">
      <bri-switch [formControl]="_formControlDisabled">
        <bri-label>Disabled</bri-label>
      </bri-switch>
    </div>
  `,
})
class DummyComponent {
  #formBuilder = inject(FormBuilder);

  _formControl = this.#formBuilder.control<boolean>(false);
  _formControlDisabled = this.#formBuilder.control<boolean>({
    value: false,
    disabled: false,
  });
}

const meta: Meta<DummyComponent> = {
  title: 'Switch',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriSwitchComponent, BriLabelDirective, ReactiveFormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
