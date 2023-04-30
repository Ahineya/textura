import type {Meta, StoryObj} from '@storybook/react';

import {TwoColumnsLayout} from './two-columns-layout';

const meta: Meta<typeof TwoColumnsLayout> = {
  title: '/TwoColumnsLayout',
  component: TwoColumnsLayout,
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof TwoColumnsLayout>;

export const Basic: Story = {
  args: {
    left: <div>Left</div>,
    right: <div>Right</div>,
  },
  render(args) {
    return (
      <div style={{
        width: '100%',
        height: '200px',
        display: 'flex',

      }}>
        <TwoColumnsLayout {...args} />
      </div>
    );
  }
};
