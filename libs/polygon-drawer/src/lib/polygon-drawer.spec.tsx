import { render } from '@testing-library/react';

import PolygonDrawer from './polygon-drawer';

describe('PolygonDrawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PolygonDrawer />);
    expect(baseElement).toBeTruthy();
  });
});
