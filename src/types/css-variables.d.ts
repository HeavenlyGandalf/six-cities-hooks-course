import 'react';

// CSS-переменные вёрстки, которые компоненты задают через style. Без этого TypeScript
// не пропустит {'--rating': ...} в style без приведения типа.
declare module 'react' {
  interface CSSProperties {
    '--rating'?: string;
  }
}
