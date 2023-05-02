import { render } from '@testing-library/react';

import Viewport3d from './viewport-3d';

describe('Viewport3d', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Viewport3d />);
    expect(baseElement).toBeTruthy();
  });
});
