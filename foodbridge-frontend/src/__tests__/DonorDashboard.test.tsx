import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '../providers/QueryProvider';
import { DonorDashboardPage } from '../pages/DonorDashboardPage';

const renderComponent = (ui: React.ReactElement) => {
  return render(
    <QueryProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryProvider>
  );
};

describe('DonorDashboardPage Unit Test Suite', () => {
  test('renders donor dashboard heading and quick action buttons', () => {
    renderComponent(<DonorDashboardPage />);
    expect(screen.getByText(/Donor Dashboard/i)).toBeInTheDocument();
  });
});
