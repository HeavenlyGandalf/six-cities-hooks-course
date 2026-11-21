import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import OfferGallery from './offer-gallery';

function createImages(count: number): string[] {
  return Array.from({length: count}, (_, index) => `/img/offers/${String(index + 1)}.jpg`);
}

describe('OfferGallery', () => {
  it('shows no more than 6 photos', () => {
    render(<OfferGallery images={createImages(7)} title="Studio" />);

    const photos = screen.getAllByRole('img');
    expect(photos).toHaveLength(6);
    expect(photos[0]).toHaveAttribute('src', '/img/offers/1.jpg');
    expect(photos[5]).toHaveAttribute('src', '/img/offers/6.jpg');
  });

  it('shows all photos when there are fewer than 6', () => {
    render(<OfferGallery images={createImages(2)} title="Studio" />);

    expect(screen.getByRole('list', {name: 'Photos'}).children).toHaveLength(2);
    expect(screen.getByAltText('Studio, photo 2')).toBeInTheDocument();
  });
});
