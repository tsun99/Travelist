import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Logo from './Logo.tsx';

describe('Logo component', () => {

  test('renders the logo image with correct alt text', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    const logoImg = screen.getByAltText('travelist logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', 'test-file-stub');
  });

  test('navigates to home page on logo click', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
        <Logo />
      </MemoryRouter>
    );
    // TODO: When homepage is implemented, change the test accordingly.
    fireEvent.click(screen.getByAltText('travelist logo'));
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

});
