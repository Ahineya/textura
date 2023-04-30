import type {Meta, StoryObj} from '@storybook/react';

import {Panel} from './panel';

const meta: Meta<typeof Panel> = {
  title: '/Panel',
  component: Panel,
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'column'],
    },
    alignItems: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
    justifyContent: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    }
  }
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Basic: Story = {
  args: {
    children: ' panel',
  }
};

export const WithPanels: Story = {
  args: {
    children: (
      <>
        <Panel>Panel 1</Panel>
        <Panel>Panel 2</Panel>
      </>
    ),
  }
}

export const WithDirection: Story = {
  args: {
    direction: 'column',
    children: (
      <>
        <Panel>Panel 1</Panel>
        <Panel>Panel 2</Panel>
      </>
    ),
  }
}

export const WithAlignment: Story = {
  args: {
    alignItems: 'center',
    justifyContent: 'center',
    children: (
      <>
        <Panel noFlex>Panel 1</Panel>
        <Panel noFlex>Panel 2</Panel>
      </>
    ),
  }
}

export const WithGap: Story = {
  args: {
    gap: 10,
    children: (
      <>
        <Panel noFlex>Panel 1</Panel>
        <Panel noFlex>Panel 2</Panel>
      </>
    ),
  }
}
