import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  {
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  globalIgnores(['.next/**', 'public/sitemap*.xml']),
]);
