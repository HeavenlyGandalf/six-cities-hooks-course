import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import ReviewForm from './review-form';

describe('ReviewForm', () => {
  it('has five rating stars from terribly to perfect', () => {
    render(<ReviewForm />);

    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
    expect(screen.getByLabelText('terribly')).toHaveAttribute('value', '1');
    expect(screen.getByLabelText('perfect')).toHaveAttribute('value', '5');
  });

  it('has a review text field with length limits and a hint', () => {
    render(<ReviewForm />);

    const textarea = screen.getByLabelText('Review text');
    expect(textarea).toHaveAttribute('minlength', '50');
    expect(textarea).toHaveAttribute('maxlength', '300');
    expect(textarea).toHaveAccessibleDescription(/at least 50 characters\./);
  });

  it('keeps Submit disabled', () => {
    render(<ReviewForm />);

    expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
  });
});
