import { render } from '@testing-library/react';

import TextureRipper from './texture-ripper';

describe('TextureRipper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TextureRipper />);
    expect(baseElement).toBeTruthy();
  });
});
