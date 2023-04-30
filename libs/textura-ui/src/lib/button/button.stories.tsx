import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: '/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: {
    children: 'New image',
  }
};

export const Padded: Story = {
  args: {
    padded: true,
    children: 'New image',
  }
}
