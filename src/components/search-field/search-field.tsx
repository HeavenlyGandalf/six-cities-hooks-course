import {type ChangeEvent, type JSX, type KeyboardEvent} from 'react';
import {UiText} from '../../const';
import {useDebouncedCallback} from '../../hooks/use-debounced-callback/use-debounced-callback';
import {DEBOUNCE_DELAY_MS} from '../../variant';

interface SearchFieldProps {
  // Набранный текст. Хранится снаружи, чтобы пережить размонтирование поля (H12, вид «Map» на телефоне).
  value: string;
  // Получает набранный текст сразу при вводе.
  onValueChange: (value: string) => void;
  // Получает строку поиска через DEBOUNCE_DELAY_MS после последнего ввода.
  onSearch: (query: string) => void;
}

const ENTER_KEY = 'Enter';

// Поле показывает набранный текст из value, а строку поиска отдаёт с задержкой.
// Enter применяет поиск сразу. Пустое поле (крестик type="search", Escape, стёртый текст)
// отменяет ожидающий поиск и сразу сбрасывает фильтр.
function SearchField({value, onValueChange, onSearch}: SearchFieldProps): JSX.Element {
  const debouncedSearch = useDebouncedCallback(onSearch, DEBOUNCE_DELAY_MS);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onValueChange(nextValue);

    if (nextValue === '') {
      debouncedSearch.cancel();
      onSearch(nextValue);
      return;
    }
    debouncedSearch(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ENTER_KEY) {
      debouncedSearch.flush();
    }
  };

  return (
    <label className="search">
      <span className="visually-hidden">{UiText.SearchByTitle}</span>
      <svg className="search__icon" aria-hidden="true"><use href="#icon-search" /></svg>
      <input
        className="field search__input"
        type="search"
        placeholder={UiText.SearchByTitle}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </label>
  );
}

export default SearchField;
