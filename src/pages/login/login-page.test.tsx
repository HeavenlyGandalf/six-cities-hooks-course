import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import LoginPage from './login-page';

describe('LoginPage', () => {
  it('renders a clean sign in form', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', {level: 1, name: 'Sign in'})).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email');
    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveValue('');
    expect(password).not.toHaveClass('field--error');
    expect(password).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('button', {name: 'Sign in'})).toHaveAttribute('type', 'submit');
  });

  it('shows the guest header with Sign in marked as current', () => {
    render(<LoginPage />);

    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', {name: 'Sign out'})).not.toBeInTheDocument();
  });

  it('links the city to the main page', () => {
    render(<LoginPage />);

    expect(screen.getByRole('link', {name: 'Explore Paris'})).toHaveAttribute('href', '/');
  });
});
