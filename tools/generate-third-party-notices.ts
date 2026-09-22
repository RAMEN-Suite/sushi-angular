import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Dirent } from 'node:fs';

const WORKSPACE_ROOT: string = resolve(process.cwd());
const STYLES_DIR: string = resolve(WORKSPACE_ROOT, 'sushi/src/styles');
const OUTPUT_FILE: string = resolve(WORKSPACE_ROOT, 'sushi/generated/NOTICES.md');
const PACKAGE_DIRECTIVE: RegExp = /@(?:import|plugin|reference)\s+["']([^"']+)["']/gu;
const LICENSE_FILE: RegExp = /^(licen[cs]e|copying)/iu;

interface PackageManifest {
  version: string;
}

function toPackageName(specifier: string): string | null {
  if (/^[./]|^https?:/u.test(specifier)) return null;

  const segments: string[] = specifier.split('/');
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0];
}

async function collectPackages(): Promise<string[]> {
  const entries: Dirent[] = await readdir(STYLES_DIR, { recursive: true, withFileTypes: true });
  const styleFiles: string[] = entries
    .filter((entry: Dirent): boolean => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry: Dirent): string => resolve(entry.parentPath, entry.name));

  const packages: Set<string> = new Set<string>();

  for (const file of styleFiles) {
    const content: string = await readFile(file, 'utf8');

    for (const [, specifier] of content.matchAll(PACKAGE_DIRECTIVE)) {
      const packageName: string | null = toPackageName(specifier);
      if (packageName) packages.add(packageName);
    }
  }

  return [...packages].sort((first: string, second: string): number => first.localeCompare(second));
}

async function readManifest(packageDir: string): Promise<PackageManifest> {
  const content: string = await readFile(resolve(packageDir, 'package.json'), 'utf8');
  return JSON.parse(content) as PackageManifest;
}

async function readNotice(packageName: string): Promise<string> {
  const packageDir: string = resolve(WORKSPACE_ROOT, 'node_modules', packageName);
  const manifest: PackageManifest = await readManifest(packageDir);
  const licenseFile: string | undefined = (await readdir(packageDir)).find((file: string): boolean => LICENSE_FILE.test(file));

  if (!licenseFile) throw new Error(`No license file found for ${packageName}.`);

  const license: string = await readFile(resolve(packageDir, licenseFile), 'utf8');
  return `## ${packageName} ${manifest.version}\n\n${license.trim()}\n`;
}

async function generateThirdPartyNotices(): Promise<void> {
  const packages: string[] = await collectPackages();

  const notices: string[] = await Promise.all(packages.map(readNotice));
  const content: string = [
    '# Third-Party Notices',
    '',
    'The bundled stylesheet contains code from the following projects.',
    '',
    ...notices,
  ].join('\n');

  await writeFile(OUTPUT_FILE, content, 'utf8');
  console.log(`Third-party notices written for: ${packages.join(', ')}`);
}

generateThirdPartyNotices().catch((error: unknown): never => {
  throw error;
});
