import reactHooks from 'eslint-plugin-react-hooks';

import htmlacademy from 'eslint-config-htmlacademy/react-typescript';

export default [
  ...htmlacademy,
  reactHooks.configs.flat.recommended,
  {
    // Курс (критерий Б21 в course/CRITERIA.md): имена всех файлов строчными через дефис,
    // включая .tsx (app.tsx, offer-card.tsx). Пресет htmlacademy 11 требует PascalCase
    // для .jsx/.tsx, поэтому правило переопределено после пресета.
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {'**/*.{js,ts,jsx,tsx}': 'KEBAB_CASE'},
        {ignoreMiddleExtensions: true},
      ],
    },
  },
];
