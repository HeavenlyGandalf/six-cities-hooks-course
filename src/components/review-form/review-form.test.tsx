import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it} from 'vitest';
import type {ReviewDraft} from '../../types/review';
import {getReviewDraftKey} from '../../utils/storage-keys';
import ReviewForm from './review-form';

const OFFER_ID = '1';
const OTHER_OFFER_ID = '2';
const DRAFT_KEY = getReviewDraftKey(OFFER_ID);

const textOf = (length: number) => 'a'.repeat(length);

// Другая вкладка записала черновик: браузер присылает в эту вкладку событие storage.
function receiveDraftFromAnotherTab(draft: ReviewDraft) {
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: DRAFT_KEY,
      newValue: JSON.stringify(draft),
      storageArea: localStorage,
    }));
  });
}

function setup() {
  const user = userEvent.setup();
  render(<ReviewForm offerId={OFFER_ID} />);
  const textarea = screen.getByLabelText('Review text');
  const submit = screen.getByRole('button', {name: 'Submit'});
  // paste быстрее type для длинных строк и так же вызывает onChange.
  const fillText = async (value: string) => {
    await user.clear(textarea);
    if (value) {
      await user.click(textarea);
      await user.paste(value);
    }
  };
  return {user, textarea, submit, fillText};
}

describe('ReviewForm', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('has five rating stars from terribly to perfect', () => {
    render(<ReviewForm offerId={OFFER_ID} />);

    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByLabelText('terribly')).toHaveAttribute('value', '1');
    expect(screen.getByLabelText('perfect')).toHaveAttribute('value', '5');
  });

  it('has a review text field with length limits and a hint', () => {
    render(<ReviewForm offerId={OFFER_ID} />);

    const textarea = screen.getByLabelText('Review text');
    expect(textarea).toHaveAttribute('minlength', '50');
    expect(textarea).toHaveAttribute('maxlength', '300');
    expect(textarea).toHaveAccessibleDescription(/at least 50 characters\./);
  });

  describe('Submit availability', () => {
    it('is disabled initially', () => {
      const {submit} = setup();

      expect(submit).toBeDisabled();
    });

    it('is disabled with a valid text but no rating', async () => {
      const {submit, fillText} = setup();

      await fillText(textOf(60));

      expect(submit).toBeDisabled();
    });

    it('is disabled with a rating but a 49-character text', async () => {
      const {user, submit, fillText} = setup();

      await user.click(screen.getByLabelText('good'));
      await fillText(textOf(49));

      expect(submit).toBeDisabled();
    });

    it.each([50, 300])('is enabled with a rating and a %s-character text', async (length) => {
      const {user, submit, fillText} = setup();

      await user.click(screen.getByLabelText('good'));
      await fillText(textOf(length));

      expect(submit).toBeEnabled();
    });

    it('does not count spaces at the edges', async () => {
      const {user, submit, fillText} = setup();

      await user.click(screen.getByLabelText('good'));
      await fillText(`   ${textOf(49)}   `);
      expect(submit).toBeDisabled();

      await fillText(`   ${textOf(50)}   `);
      expect(submit).toBeEnabled();
    });

    it('cannot take more than 300 characters', async () => {
      const {textarea, fillText} = setup();

      await fillText(textOf(310));

      expect(textarea).toHaveValue(textOf(300));
    });
  });

  describe('text error', () => {
    it('is not shown while typing before the field loses focus', async () => {
      const {textarea, fillText} = setup();

      await fillText(textOf(10));

      expect(textarea).not.toHaveClass('field--error');
      expect(screen.queryByText('Review must be 50 to 300 characters')).not.toBeInTheDocument();
    });

    it('is shown after blur for a short text and removed once the text is valid', async () => {
      const {user, textarea, fillText} = setup();

      await fillText(textOf(10));
      await user.tab();

      expect(textarea).toHaveClass('field--error');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAccessibleDescription(/Review must be 50 to 300 characters/);

      await fillText(textOf(50));

      expect(textarea).not.toHaveClass('field--error');
      expect(textarea).not.toHaveAttribute('aria-invalid');
      expect(screen.queryByText('Review must be 50 to 300 characters')).not.toBeInTheDocument();
    });

    it('is shown after blur for a text of spaces only', async () => {
      const {user, textarea, fillText} = setup();

      await fillText('   ');
      await user.tab();

      expect(textarea).toHaveClass('field--error');
    });

    it('is not shown after blur for an empty field', async () => {
      const {user, textarea} = setup();

      await user.click(textarea);
      await user.tab();

      expect(textarea).not.toHaveClass('field--error');
    });
  });

  it('clears the form after Submit', async () => {
    const {user, textarea, submit, fillText} = setup();

    await user.click(screen.getByLabelText('good'));
    await fillText(textOf(60));
    await user.click(submit);

    expect(textarea).toHaveValue('');
    expect(screen.getByLabelText('good')).not.toBeChecked();
    expect(submit).toBeDisabled();
  });

  it('does not show the error while typing again after Submit', async () => {
    const {user, textarea, submit, fillText} = setup();

    await user.click(screen.getByLabelText('good'));
    await fillText(textOf(60));
    await user.tab();
    await user.click(submit);
    await fillText(textOf(10));

    expect(textarea).not.toHaveClass('field--error');
  });

  it('does not clear an invalid form on submit', async () => {
    const {textarea, fillText} = setup();

    await fillText(textOf(10));
    // Кнопка выключена, поэтому отправка вызывается на форме напрямую.
    fireEvent.submit(screen.getByRole('button', {name: 'Submit'}).closest('form') ?? document.body);

    expect(textarea).toHaveValue(textOf(10));
  });

  describe('draft', () => {
    it('saves the rating and the text under the draft key', async () => {
      const {user, fillText} = setup();

      await user.click(screen.getByLabelText('good'));
      await fillText('Nice flat');

      expect(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '')).toEqual({rating: 4, text: 'Nice flat'});
    });

    it('is restored when the form is opened again', async () => {
      const user = userEvent.setup();
      const {unmount} = render(<ReviewForm offerId={OFFER_ID} />);
      await user.click(screen.getByLabelText('good'));
      await user.type(screen.getByLabelText('Review text'), 'Nice flat');

      unmount();
      render(<ReviewForm offerId={OFFER_ID} />);

      expect(screen.getByLabelText('Review text')).toHaveValue('Nice flat');
      expect(screen.getByLabelText('good')).toBeChecked();
    });

    it('is removed after Submit', async () => {
      const {user, submit, fillText} = setup();

      await user.click(screen.getByLabelText('good'));
      await fillText(textOf(60));
      await user.click(submit);

      expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('is not shown on another offer', () => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({rating: 4, text: 'Nice flat'}));

      render(<ReviewForm offerId={OTHER_OFFER_ID} />);

      expect(screen.getByLabelText('Review text')).toHaveValue('');
    });

    it('gives an empty form for a broken draft', () => {
      localStorage.setItem(DRAFT_KEY, '{rating:');

      const {textarea} = setup();

      expect(textarea).toHaveValue('');
    });

    it('picks up changes from another tab', () => {
      const {textarea} = setup();

      receiveDraftFromAnotherTab({rating: 5, text: 'From another tab'});

      expect(textarea).toHaveValue('From another tab');
      expect(screen.getByLabelText('perfect')).toBeChecked();
    });
  });
});
