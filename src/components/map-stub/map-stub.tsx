import type {JSX} from 'react';
import {UiText} from '../../const';

interface MapStubProps {
  // Сколько синих маркеров показать; позиций в схеме не больше, чем в PIN_POSITIONS.
  pinCount: number;
}

// Положение маркеров в схеме, % от ширины и высоты карты (course/markup/offer.html).
// Маркеры декоративные: настоящие координаты появятся с Яндекс Картами в истории 5.4.
const PIN_POSITIONS = [
  {left: '24%', top: '34%'},
  {left: '70%', top: '30%'},
  {left: '36%', top: '76%'},
] as const;

const ACTIVE_PIN_POSITION = {left: '52%', top: '54%'} as const;

// Статичная схема карты из вёрстки: синие маркеры соседних и оранжевый у текущего предложения.
function MapStub({pinCount}: MapStubProps): JSX.Element {
  return (
    <div className="map">
      {PIN_POSITIONS.slice(0, pinCount).map((position) => (
        <span key={`${position.left} ${position.top}`} className="map__pin" style={position}>
          <svg aria-hidden="true"><use href="#icon-pin" /></svg>
        </span>
      ))}
      <span className="map__pin map__pin--active" style={ACTIVE_PIN_POSITION}>
        <svg aria-hidden="true"><use href="#icon-pin" /></svg>
      </span>
      <span className="map__note">{UiText.MapNote}</span>
    </div>
  );
}

export default MapStub;
