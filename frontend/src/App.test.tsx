import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // App renders with router and auth provider
  expect(document.body).toBeInTheDocument();
});