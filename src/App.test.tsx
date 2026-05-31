import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock all API calls to return empty data
jest.mock('./services/api', () => ({
  __esModule: true,
  fetchMarketData: () => Promise.resolve([]),
  fetchCoinHistory: () => Promise.resolve([]),
}));

test('renders crypto dashboard without crashing', async () => {
  await act(async () => {
    render(<App />);
    // Wait for async state updates to settle
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  const headingElement = screen.getByText(/BlockLens/i);
  expect(headingElement).toBeInTheDocument();
});
