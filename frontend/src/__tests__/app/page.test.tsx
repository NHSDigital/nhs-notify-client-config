import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

describe('Home page', () => {
  it('renders the Hello World heading', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  });

  it('renders a main landmark', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});