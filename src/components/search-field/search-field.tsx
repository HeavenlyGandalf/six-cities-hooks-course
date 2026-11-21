import {useState, type ChangeEvent, type JSX, type KeyboardEvent} from 'react';
import {UiText} from '../../const';
import {useDebouncedCallback} from '../../hooks/use-debounced-callback/use-debounced-callback';
import {DEBOUNCE_DELAY_MS} from '../../variant';

interface SearchFieldProps {
  // Получает строку поиска через DEBOUNCE_DELAY_MS после последнего ввода.
  onSearch: (query: string) => void;
}

const ENTER_KEY = 'Enter';

// Поле хранит то, что набрано, а наружу отдаёт строку с задержкой.
// Enter применяет поиск сразу. Пустое поле (крестик type="search", Escape, стёртый текст)
// отменяет ожидающий поиск и сразу сбрасывает фильтр.
function SearchField({onSearch}: SearchFieldProps): JSX.Element {
  const [value, setValue] = useState('');
  const debouncedSearch = useDebouncedCallback(onSearch, DEBOUNCE_DELAY_MS);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);

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
