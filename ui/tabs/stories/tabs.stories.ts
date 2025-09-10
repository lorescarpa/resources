import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { BriTabsModule } from './../src';

@Component({
  template: `<div style="width: 1200px">
    <bri-tab-group>
      <bri-tab label="first tab">First Tab Content</bri-tab>
      <bri-tab>
        <ng-template briTabLabel>Second Tab</ng-template>
        <ng-template briTabContent>Second Tab Content</ng-template>
      </bri-tab>
    </bri-tab-group>
  </div>`,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Tabs',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({ imports: [BriTabsModule] }),
  ],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
