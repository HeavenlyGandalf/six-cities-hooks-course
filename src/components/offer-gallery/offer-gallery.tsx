import type {JSX} from 'react';
import {MAX_IMAGES, UiText} from '../../const';

interface OfferGalleryProps {
  images: string[];
  title: string;
}

// Размеры фото из вёрстки (course/markup/offer.html).
const ImageSize = {
  Width: 800,
  Height: 600,
} as const;

// Фото первого экрана грузятся сразу: это первый ряд сетки на десктопе (3 колонки, pages/offer.css).
// На телефоне и планшете на первом экране их меньше. Остальные - с loading="lazy" (AD-19).
const EAGER_IMAGES_COUNT = 3;

// Больше MAX_IMAGES фото не выводится.
function OfferGallery({images, title}: OfferGalleryProps): JSX.Element {
  return (
    <ul className="gallery" aria-label={UiText.PhotosLabel}>
      {images.slice(0, MAX_IMAGES).map((image, index) => (
        <li key={image} className="gallery__item">
          <img
            className="gallery__image"
            src={image}
            width={ImageSize.Width}
            height={ImageSize.Height}
            alt={`${title}, ${UiText.Photo} ${String(index + 1)}`}
            loading={index < EAGER_IMAGES_COUNT ? undefined : 'lazy'}
          />
        </li>
      ))}
    </ul>
  );
}

export default OfferGallery;
