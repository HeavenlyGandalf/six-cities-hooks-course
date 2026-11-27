import {useRef, useState, type JSX} from 'react';
import {SORT_OPTIONS, UiText, type SortOption} from '../../const';
import {useOutsideClick} from '../../hooks/use-outside-click/use-outside-click';
import {useKeydown} from '../../hooks/use-keydown/use-keydown';

interface SortMenuProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

function SortMenu({sort, onSortChange}: SortMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedOption, setFocusedOption] = useState(sort);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef(new Map<SortOption, HTMLLIElement>());

  const closeWithFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };
  const selectOption = (option: SortOption, returnFocus: boolean) => {
    onSortChange(option);
    setIsOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  };
  const isMenuEvent = (event: KeyboardEvent) => event.target instanceof Node && menuRef.current?.contains(event.target);
  const moveFocus = (event: KeyboardEvent, direction: number) => {
    if (!isMenuEvent(event)) {
      return;
    }
    event.preventDefault();
    const index = SORT_OPTIONS.indexOf(focusedOption);
    const next = SORT_OPTIONS[(index + direction + SORT_OPTIONS.length) % SORT_OPTIONS.length];
    setFocusedOption(next);
    optionsRef.current.get(next)?.focus();
  };

  useOutsideClick(menuRef, () => {
    setIsOpen(false);
  }, isOpen);
  useKeydown('Escape', (event) => {
    event.preventDefault();
    closeWithFocus();
  }, isOpen);
  useKeydown('ArrowDown', (event) => {
    moveFocus(event, 1);
  }, isOpen);
  useKeydown('ArrowUp', (event) => {
    moveFocus(event, -1);
  }, isOpen);
  useKeydown('Enter', (event) => {
    if (!isMenuEvent(event)) {
      return;
    }
    event.preventDefault();
    selectOption(focusedOption, true);
  }, isOpen);

  return (
    <div className={`sort${isOpen ? ' sort--opened' : ''}`} ref={menuRef}>
      <span className="sort__caption" id="sort-caption">{UiText.SortBy}</span>
      <button
        className="sort__current"
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="sort-caption sort-current"
        onClick={() => {
          setFocusedOption(sort);
          setIsOpen(!isOpen);
        }}
      >
        <span id="sort-current">{sort}</span>
        <svg className="sort__arrow" aria-hidden="true"><use href="#icon-arrow" /></svg>
      </button>
      <ul className="sort__list" hidden={!isOpen} role="listbox" aria-labelledby="sort-caption">
        {SORT_OPTIONS.map((option) => (
          <li
            key={option}
            ref={(element) => {
              if (element) {
                optionsRef.current.set(option, element);
              } else {
                optionsRef.current.delete(option);
              }
            }}
            className={`sort__option${option === sort ? ' sort__option--active' : ''}${option === focusedOption ? ' sort__option--focused' : ''}`}
            role="option"
            aria-selected={option === sort}
            tabIndex={0}
            onFocus={() => {
              setFocusedOption(option);
            }}
            onClick={() => {
              selectOption(option, false);
            }}
            onKeyDown={(event) => {
              if (event.key === ' ') {
                event.preventDefault();
                selectOption(option, true);
              }
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SortMenu;
