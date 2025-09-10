import { Component } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { BriTableModule } from './../src';

@Component({
  template: `
    <div style="width: 400px; height: 300px">
      <div bri-table-skeleton columns="3" rows="3"></div>
    </div>
  `,
  imports: [BriTableModule],
  standalone: true,
})
class DummyComponent {
  _displayedColumns: string[] = [
    'firstName',
    'lastName',
    'jobType',
    'jobTitle',
  ];
}

const meta: Meta<DummyComponent> = {
  title: 'Table',
  component: DummyComponent,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Skeleton: Story = {};
