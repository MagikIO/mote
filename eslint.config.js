import { defineConfig } from 'eslint/config';
import { LintGolem } from '@magik_io/lint_golem';


export default defineConfig(
  ...new LintGolem({
    rootDir: import.meta.dirname,
    tsconfigPaths: ['tsconfig.json'],
    disabledRules: ['n/no-unsupported-features/node-builtins', 'n/no-missing-import'],
  }).config
);
