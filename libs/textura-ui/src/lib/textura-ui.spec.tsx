import { render } from '@testing-library/react';

import TexturaUi from './textura-ui';

describe('TexturaUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TexturaUi />);
    expect(baseElement).toBeTruthy();
  });
});
