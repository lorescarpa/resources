import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriSkeletonLoaderModule } from '../src';
// <bri-skeleton-loader style="width: 100px; height: 30px;" />
@Component({
  template: `
    <div
      style="display: flex; flex-direction: column; align-items: center; gap: 10px; border: 1px solid #000000; border-radius: 4px; width: 150px; height: 100px; padding: 10px;"
    >
      <div>Title</div>
      <div>Body</div>
    </div>

    <div
      style="display: flex; flex-direction: column; align-items: center; gap: 10px; border: 1px solid #000000; border-radius: 4px; width: 150px; height: 100px; padding: 10px;"
    >
      <div>
        <bri-skeleton-loader style="width: 30px; height: 20px;" />
        <bri-skeleton-loader style="width: 50px; height: 20px;" />
      </div>
      <div>
        <bri-skeleton-loader style="width: 50px; height: 20px;" />
        <bri-skeleton-loader style="width: 50px; height: 20px;" />
      </div>
    </div>
  `,
})
class DummyComponent {
  constructor() {}
}

const meta: Meta<DummyComponent> = {
  title: 'Skeleton Loader',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriSkeletonLoaderModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
