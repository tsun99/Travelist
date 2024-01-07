import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Button from './Button.tsx';

test('Button renders with correct text and triggers callback', () => {
  const handleClick = jest.fn();
  render(<Button title="Click me" handleClick={handleClick} theme="green" />);

  const buttonElement = screen.getByText('Click me');
  expect(buttonElement).toBeInTheDocument();
  
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
