import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriBreadcrumbComponent, BriBreadcrumbItemDirective } from '../src';

@Component({
  template: `
    <bri-breadcrumb>
      <bri-breadcrumb-item label="first" />
      <bri-breadcrumb-item label="second" disabled />
      <bri-breadcrumb-item label="third" selected />
    </bri-breadcrumb>
  `,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Breadcrumb',
  component: DummyComponent,
  parameters: { layout: 'centered' },
  decorators: [
    moduleMetadata({
      imports: [BriBreadcrumbComponent, BriBreadcrumbItemDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const WithDisabledItems: Story = {};
