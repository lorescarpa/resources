import { Component, signal } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { navigationAndActionIcons } from '@wkp/bricks/svg/navigation-and-action';
import { BriIconComponent, injectIcons } from '../src';

@Component({
  standalone: true,
  template: ` <div
    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 20px; max-width: 1200px"
  >
    @for(groupedIcons of icons(); track groupedIcons) { 
      
      
      @for(icon of
    groupedIcons; track icon.name) {
    <div
      style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 20px; background-color: #f7f7f7; border-radius: 4px;"
    >
      <bri-icon [name]="icon.name"></bri-icon>
      <div style="text-align: center">
        <span style="font-size: 16px;">{{ icon.name }}</span>
      </div>
    </div>

    } }
  </div>`,

  imports: [BriIconComponent],
})
class DummyComponent {
  icons = signal([navigationAndActionIcons]);

  constructor() {
    injectIcons(navigationAndActionIcons);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Icon',
  component: DummyComponent,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
