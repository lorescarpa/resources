import { Component, ElementRef, Input, ViewChild, booleanAttribute } from '@angular/core';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { BriCheckboxDirective } from '../src';

@Component({
  selector: 'bri-dummy-checkbox',
  template: `<input type="checkbox" briCheckbox #checkbox />`,
  styleUrls: ['./../src/checkbox.scss']
})
class DummyComponent {
  @Input({ transform: booleanAttribute })
  set checked(value: boolean) {
    this._checkbox.nativeElement.indeterminate = false;
    this._checkbox.nativeElement.checked = value;
  }

  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this._checkbox.nativeElement.disabled = value;
  }

  @Input({ transform: booleanAttribute })
  set indeterminate(value: boolean) {
    this._checkbox.nativeElement.checked = false;
    this._checkbox.nativeElement.indeterminate = value;
  }

  @ViewChild('checkbox') _checkbox!: ElementRef<HTMLInputElement>;
}

const meta: Meta<DummyComponent> = {
  title: 'Checkbox',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [moduleMetadata({ imports: [BriCheckboxDirective] })],
  render: (args) => ({
    props: args,
    template: `<bri-dummy-checkbox ${argsToTemplate(args)}></bri-dummy-checkbox>`
  })
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false
  }
};
