import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import ErrorScreen from './error-screen';

describe('ErrorScreen', () => {
  it('shows the server unavailable alert from the markup', () => {
    const {container} = render(<ErrorScreen />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('empty');
    expect(screen.getByRole('heading', {name: 'Server is unavailable'})).toHaveClass('empty__title');
    expect(alert).toHaveTextContent('We could not load the data. Check your connection and try again in a minute.');
    expect(container.querySelector('svg.server-art')).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onRetry on Try again', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorScreen onRetry={onRetry} />);

    await user.click(screen.getByRole('button', {name: 'Try again'}));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
