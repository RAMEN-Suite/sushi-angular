import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const bundleDirectory: string = resolve('dist/sushi/fesm2022');
const buildDirective: RegExp = /@(apply|reference|tailwind)\b/u;
const bundles: readonly string[] = readdirSync(bundleDirectory).filter((file: string): boolean => file.endsWith('.mjs'));

for (const file of ['../styles.css', ...bundles]) {
  const path: string = resolve(bundleDirectory, file);
  const source: string = readFileSync(path, 'utf8');
  if (buildDirective.test(source)) throw new Error(`Uncompiled CSS build directive in ${path}.`);
}
