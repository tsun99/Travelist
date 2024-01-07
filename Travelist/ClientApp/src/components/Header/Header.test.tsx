import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from './Header.tsx';

describe('Header component', () => {
  
  test('renders Logo and Nav components', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoElement = screen.getByRole('img', { name: /logo/i }); 
    const navElement = screen.getByRole('navigation');
    expect(logoElement).toBeInTheDocument();
    expect(navElement).toBeInTheDocument();
  });
  
  test('updates isSticky on scroll and updates class', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).not.toHaveClass('border-gray border-b');
    
    fireEvent.scroll(window, { target: { scrollY: 1 } });
    expect(screen.getByRole('banner')).toHaveClass('border-gray border-b');
    
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    expect(screen.getByRole('banner')).not.toHaveClass('border-gray border-b');
  });
  
});
