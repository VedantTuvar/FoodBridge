import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('AdminPanel Unit Test Suite', () => {
  test('renders platform operations control center title', async () => {
    renderWithRouter(<AdminDashboardPage />);
    const heading = await screen.findByText(/Platform Operations Dashboard/i);
    expect(heading).toBeInTheDocument();
  });
});
