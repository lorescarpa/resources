import { Meta, StoryObj, argsToTemplate } from '@storybook/angular';
import { BriPaginatorComponent } from '../src/paginator.component';

const meta: Meta<BriPaginatorComponent> = {
  title: 'Paginator',
  component: BriPaginatorComponent,
  argTypes: { page: { action: 'page changed' } },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<BriPaginatorComponent>;

export const Primary: Story = {
  args: {
    pageIndex: 0,
    length: 100,
    pageSize: 50,
    visiblePages: 3,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<bri-paginator length="100" ${argsToTemplate(
      args
    )}></bri-paginator>`,
  }),
};
