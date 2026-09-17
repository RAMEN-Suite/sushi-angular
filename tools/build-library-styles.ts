import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';
import type { Result } from 'postcss';

const TOOL_DIRECTORY: string = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT: string = resolve(TOOL_DIRECTORY, '..');
const SOURCE_FILE: string = resolve(WORKSPACE_ROOT, 'sushi/src/styles/sushi.source.css');
const OUTPUT_FILE: string = resolve(WORKSPACE_ROOT, 'sushi/generated/styles.css');
const BUILD_DIRECTIVE: RegExp = /@(import|plugin|reference|source)\b/u;

async function buildLibraryStyles(): Promise<void> {
  const source: string = await readFile(SOURCE_FILE, 'utf8');
  const result: Result = await postcss([tailwind()]).process(source, {
    from: SOURCE_FILE,
    map: false,
    to: OUTPUT_FILE,
  });

  if (BUILD_DIRECTIVE.test(result.css)) throw new Error('The generated stylesheet still contains build directives.');

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, result.css, 'utf8');
}

buildLibraryStyles().catch((error: unknown): never => {
  throw error;
});
