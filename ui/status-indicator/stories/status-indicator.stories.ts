import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { BriStatusIndicatorModule } from '../src';

@Component({
  template: `<bri-status-indicator
    type="success"
    title="User created"
    message="New user has been successfully inserted"
  />`,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Status Indicator',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({ imports: [BriStatusIndicatorModule] }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
