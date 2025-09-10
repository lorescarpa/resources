import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriBreadcrumbSkeletonComponent } from '../src';

@Component({
  template: `
    <bri-breadcrumb-skeleton repetitions="4"></bri-breadcrumb-skeleton>
  `,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Breadcrumb',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriBreadcrumbSkeletonComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const WithSkeleton: Story = {};
