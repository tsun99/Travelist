import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Nav from './Nav.tsx';

describe('Nav component', () => {

  test('navigates to correct paths on button click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    // TODO: When register and login pages are implemented, change the tests accordingly.
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sign up'));
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });
  
});
