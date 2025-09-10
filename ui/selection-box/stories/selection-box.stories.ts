import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriSelectionBoxModule } from '../src';

@Component({
  template: `
    <bri-selection-box>
      <bri-selection-box-item cdkOption="test" />
    </bri-selection-box>
  `,
  styleUrl: './../../radio/src/radio.scss',
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Selection Box',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [moduleMetadata({ imports: [BriSelectionBoxModule] })],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
