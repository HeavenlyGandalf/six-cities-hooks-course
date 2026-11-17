import type {JSX} from 'react';
import {UiText} from '../../const';
import type {Host} from '../../types/user';

interface OfferHostProps {
  host: Host;
  description: string;
}

// Размер аватара хозяина из вёрстки, px.
const AVATAR_SIZE = 74;

function OfferHost({host, description}: OfferHostProps): JSX.Element {
  const {name, avatarUrl, isPro} = host;

  return (
    <div className={`host${isPro ? ' host--pro' : ''}`}>
      <div className="host__user">
        <div className="host__avatar-wrapper">
          <img className="host__avatar" src={avatarUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} alt="" loading="lazy" />
          {isPro && <svg className="host__pro-icon" aria-hidden="true"><use href="#icon-star" /></svg>}
        </div>
        <div>
          <p className="host__name">{name}</p>
          {isPro && <p className="host__status">{UiText.Pro}</p>}
        </div>
      </div>
      <div className="host__description">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default OfferHost;
