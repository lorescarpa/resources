import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  Meta,
  StoryObj,
  argsToTemplate,
  moduleMetadata,
} from '@storybook/angular';
import { BriRadioDirective } from '../src';

@Component({
  selector: 'bri-dummy-radio',
  template: `<input type="radio" briRadio #radio />`,
  styleUrls: ['./../src/radio.scss'],
})
class DummyComponent {
  @Input()
  set checked(value: boolean) {
    this.radio.nativeElement.checked = value;
  }

  @Input()
  set disabled(value: boolean) {
    this.radio.nativeElement.disabled = value;
  }

  @ViewChild('radio') radio!: ElementRef<HTMLInputElement>;
}

const meta: Meta<DummyComponent> = {
  title: 'Radio',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [moduleMetadata({ imports: [BriRadioDirective] })],
  render: (args) => ({
    props: args,
    template: `<bri-dummy-radio ${argsToTemplate(args)}></bri-dummy-radio>`,
  }),
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};
