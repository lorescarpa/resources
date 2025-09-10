import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriIconComponent, injectIcons } from '@wkp/bricks/icon';
import { navigationAndActionIcons } from '@wkp/bricks/svg/navigation-and-action';
import {
  BriAnchorComponent,
  BriButtonComponent,
  BriIconButtonComponent,
} from '../src';

@Component({
  template: `
    <div
      style="display:grid; grid-template-columns: repeat(7, 1fr); column-gap: 10px; row-gap:30px; align-items:center"
    >
      <div
        style="display: flex; flex-direction: row; justify-content: center; text-transform:uppercase"
      >
        Default
      </div>
      <button bri-button>Primary button</button>
      <button bri-button color="secondary">Secondary button</button>
      <button bri-text-button>
        <bri-icon name="download"></bri-icon>
        <span>Primary text button</span>
      </button>
      <button bri-text-button color="secondary">
        <bri-icon name="arrow-forth" iconPositionEnd></bri-icon>
        <span>Secondary text button</span>
      </button>
      <div style="display: flex; justify-content: center;">
        <button bri-icon-button>
          <bri-icon name="arrow-forth"></bri-icon>
        </button>
      </div>
      <a bri-text-button>Primary Link button</a>

      <div
        style="display: flex; flex-direction: row; justify-content: center; text-transform:uppercase"
      >
        Disabled
      </div>
      <button bri-button disabled>Primary button</button>
      <button bri-button color="secondary" disabled>Secondary button</button>
      <button bri-text-button disabled>
        <bri-icon name="download"></bri-icon>
        <span>Primary text button</span>
      </button>
      <button bri-text-button color="secondary" disabled>
        <bri-icon name="arrow-forth" iconPositionEnd></bri-icon>
        <span>Secondary text button</span>
      </button>
      <div style="display: flex; justify-content: center;">
        <button bri-icon-button disabled>
          <bri-icon name="arrow-forth"></bri-icon>
        </button>
      </div>
      <a bri-text-button disabled>Primary Link button</a>
    </div>
  `,
})
class DummyComponent {
  constructor() {
    injectIcons(navigationAndActionIcons);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Button',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [
        BriButtonComponent,
        BriIconButtonComponent,
        BriAnchorComponent,
        BriIconComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
