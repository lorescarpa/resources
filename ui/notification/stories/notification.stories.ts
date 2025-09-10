import { Component, inject } from '@angular/core';
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { BriNotification, BriNotificationModule } from '../src';
import { BriButtonModule } from '@wkp/bricks/button';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  template: `
    <button bri-button color="secondary" (click)="openNotification()">
      Open notification
    </button>
  `,
})
class DummyComponent {
  private _notification = inject(BriNotification);

  openNotification(): void {
    this._notification.open(
      'urgent',
      'Error',
      'Error to retrieve information',
      ''
    );
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Notification',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({ imports: [BriButtonModule, BriNotificationModule] }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
