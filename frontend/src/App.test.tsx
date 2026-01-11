import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard text', () => {
  render(<App />);
  expect(screen.getByText('WoodShopPro Dashboard')).toBeInTheDocument();
});