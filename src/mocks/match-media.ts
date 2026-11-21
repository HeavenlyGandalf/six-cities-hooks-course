// Мок window.matchMedia: в jsdom его нет. Списки отвечают по ширине окна, которую задаёт тест.
// Понимает только (max-width: Npx) и (min-width: Npx); другой запрос - ошибка, чтобы опечатка не прошла молча.

// Ширины из ручной проверки (AGENTS.md): телефон, планшет, десктоп.
export const TestWidth = {
  Phone: 375,
  Tablet: 768,
  Desktop: 1440,
} as const;

const WIDTH_QUERY_PATTERN = /^\((max|min)-width:\s*(\d+)px\)$/;

function matchesWidth(query: string, width: number): boolean {
  const match = WIDTH_QUERY_PATTERN.exec(query.trim());
  if (match === null) {
    throw new Error(`matchMedia mock: unsupported query "${query}"`);
  }
  const [, kind, value] = match;
  const limit = Number(value);
  return kind === 'max' ? width <= limit : width >= limit;
}

function callListener(listener: EventListenerOrEventListenerObject, event: Event): void {
  if (typeof listener === 'function') {
    listener(event);
  } else {
    listener.handleEvent(event);
  }
}

let currentWidth: number = TestWidth.Desktop;
let createdLists: FakeMediaQueryList[] = [];

class FakeMediaQueryList implements MediaQueryList {
  readonly media: string;
  onchange: MediaQueryList['onchange'] = null;
  readonly listeners = new Set<EventListenerOrEventListenerObject>();

  constructor(media: string) {
    this.media = media;
    // Проверяем запрос сразу, как браузер разбирает его при вызове matchMedia.
    matchesWidth(media, currentWidth);
  }

  get matches(): boolean {
    return matchesWidth(this.media, currentWidth);
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (type === 'change' && listener !== null) {
      this.listeners.add(listener);
    }
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (type === 'change' && listener !== null) {
      this.listeners.delete(listener);
    }
  }

  // Устаревшие addListener и removeListener хук не использует; оставлены ради интерфейса MediaQueryList.
  addListener(): void {
    throw new Error('matchMedia mock: addListener is deprecated, use addEventListener');
  }

  removeListener(): void {
    throw new Error('matchMedia mock: removeListener is deprecated, use removeEventListener');
  }

  dispatchEvent(event: Event): boolean {
    this.listeners.forEach((listener) => {
      callListener(listener, event);
    });
    return true;
  }
}

function matchMedia(query: string): MediaQueryList {
  const list = new FakeMediaQueryList(query);
  createdLists.push(list);
  return list;
}

// Ставит мок с заданной шириной окна. Вызывается перед каждым тестом в setup-tests.ts.
export function installMatchMedia(width: number = TestWidth.Desktop): void {
  currentWidth = width;
  createdLists = [];
  Object.defineProperty(window, 'matchMedia', {value: matchMedia, configurable: true, writable: true});
}

export function uninstallMatchMedia(): void {
  createdLists = [];
  Reflect.deleteProperty(window, 'matchMedia');
}

// Меняет ширину окна и шлёт change тем спискам, у которых изменился matches. В тестах React - внутри act.
export function setWidth(width: number): void {
  const previousWidth = currentWidth;
  currentWidth = width;
  createdLists
    .filter((list) => list.listeners.size > 0 && matchesWidth(list.media, previousWidth) !== list.matches)
    .forEach((list) => {
      list.dispatchEvent(new Event('change'));
    });
}

// Сколько слушателей change подписано на запрос во всех списках с этим запросом.
export function getListenerCount(query: string): number {
  return createdLists
    .filter((list) => list.media === query)
    .reduce((count, list) => count + list.listeners.size, 0);
}
