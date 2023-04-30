import type {Meta, StoryObj} from '@storybook/react';

import {FloatingPanel} from './floating-panel';

const meta: Meta<typeof FloatingPanel> = {
  title: '/FloatingPanel',
  component: FloatingPanel,
  argTypes: {
    padding: {
      control: 'radio',
      options: ['none', 'small', 'full'],
    }
  }
};

export default meta;
type Story = StoryObj<typeof FloatingPanel>;

export const Basic: Story = {
  args: {
    children: 'Floating panel',
  }
};

export const Padding: Story = {
  args: {
    padding: 'full',
    children: 'Floating panel',
  }
}
