import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import Footer from './Footer.tsx';

test('renders the footer with correct text', () => {
  const currentYear = new Date().getFullYear();
  render(<Footer />);
  const footerText = screen.getByText(`© ${currentYear} Travelist. All Rights Reserved.`);
  expect(footerText).toBeInTheDocument();
});