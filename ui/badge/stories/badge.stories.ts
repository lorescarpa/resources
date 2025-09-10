import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriIconComponent, injectIcons } from '@wkp/bricks/icon';
import { navigationAndActionIcons } from '@wkp/bricks/svg/navigation-and-action';
import { BriBadgeDirective } from '../src';

@Component({
  template: `
    <bri-icon
      aria-hidden="false"
      name="unpreferred"
      style="width: 24px; height: 24px"
      briBadge="2"
      briBadgeColor="primary"
    />
  `,
})
class DummyComponent {
  constructor() {
    injectIcons(navigationAndActionIcons);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Badge',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriBadgeDirective, BriIconComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
