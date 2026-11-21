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

// Галерея на первом экране, поэтому фото без loading="lazy". Больше MAX_IMAGES не выводится.
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
          />
        </li>
      ))}
    </ul>
  );
}

export default OfferGallery;
