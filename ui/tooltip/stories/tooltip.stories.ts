import { Component, ViewChild } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { BriTooltipModule } from '../src';

@Component({
  standalone: true,
  template: `<span briTooltip="test">tooltip</span>
    <span [briTooltip]="test">tooltip</span>
    <ng-template #test
      >11-digit numeric. If the new authorized representative does not have a
      German tax identification number (TIN), the digital application form
      cannot be used. In this case, please contact your HVB Bank
      contact.</ng-template
    >`,
  imports: [BriTooltipModule],
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Tooltip',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
