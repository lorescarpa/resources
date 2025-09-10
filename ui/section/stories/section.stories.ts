import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BriSectionModule } from './../src';
import { BriSkeletonLoaderModule } from '@wkp/bricks/skeleton-loader';

@Component({
  template: `
    <bri-section>
      <div briSectionTitle>Section title</div>

      <div style="display: flex; align-items: center">
        <bri-section-data>
          <div briSectionDataLabel>label</div>
          <div briSectionDataValue>value</div>
        </bri-section-data>
        <bri-section-data>
          <div briSectionDataLabel>
            <bri-skeleton-loader style="width: 120px; height: 14px" />
          </div>
          <div briSectionDataValue>
            <bri-skeleton-loader style="width: 40px; height: 18px" />
            <bri-skeleton-loader style="width: 60px; height: 18px" />
          </div>
        </bri-section-data>
      </div>
      <div briSectionDisclaimer>test</div>
    </bri-section>
  `,
})
class DummyComponent {}

const meta: Meta<DummyComponent> = {
  title: 'Section',
  component: DummyComponent,
  decorators: [
    moduleMetadata({
      imports: [BriSectionModule, BriSkeletonLoaderModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
