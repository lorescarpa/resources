import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriTagComponent } from '../src';

@Component({
  template: `<div style="display: flex; flex-direction: row; gap: 10px">
    <bri-tag color="#004C3D">fxd</bri-tag>
    <bri-tag color="transparent" />
  </div>`,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Tag',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriTagComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
