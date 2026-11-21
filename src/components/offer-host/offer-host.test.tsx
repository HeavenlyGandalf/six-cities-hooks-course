import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {Host} from '../../types/user';
import OfferHost from './offer-host';

const host: Host = {name: 'Angelina', avatarUrl: '/img/avatars/avatar-angelina.svg', isPro: true};

describe('OfferHost', () => {
  it('marks a Pro host', () => {
    const {container} = render(<OfferHost host={host} description="Quiet place." />);

    expect(container.firstElementChild).toHaveClass('host', 'host--pro');
    expect(screen.getByText('Angelina')).toHaveClass('host__name');
    expect(screen.getByText('Pro')).toHaveClass('host__status');
    expect(container.querySelector('.host__pro-icon')).toBeInTheDocument();
    expect(screen.getByText('Quiet place.')).toBeInTheDocument();
  });

  it('has no Pro mark for a regular host', () => {
    const {container} = render(<OfferHost host={{...host, isPro: false}} description="Quiet place." />);

    expect(container.firstElementChild).not.toHaveClass('host--pro');
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
    expect(container.querySelector('.host__pro-icon')).not.toBeInTheDocument();
  });
});
