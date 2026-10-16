import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { ApiReferenceData, ApiTypeDefinition } from '../../playground/src/app/shared/api-reference/api-reference.types';
import type { GeneratedApi } from './generated-file';
import { generateApiReference } from './generator';

const fixtureRoots: string[] = [];
const FIXTURE_FILES: Readonly<Record<string, string>> = {
  'sushi/tsconfig.lib.json': JSON.stringify({
    compilerOptions: { experimentalDecorators: true, target: 'ES2022' },
    include: ['src/**/*.ts'],
  }),
  'sushi/src/public-api.ts': "export * from './lib/example/example.component';",
  'sushi/src/lib/example/example.component.ts': `
    declare function Component(metadata: unknown): ClassDecorator;
    declare function Directive(metadata: unknown): ClassDecorator;
    declare function input<T>(value: T): T;

    /** Nested options resolved through a symbol instead of a text search. */
    export interface DetailOptions { readonly compact?: boolean; }

    /** Options visible through the component API. */
    export interface ExampleOptions<T = string> {
      readonly value?: T;
      readonly details?: DetailOptions;
    }

    /** Context exposed by the item template. */
    export interface ExampleItemContext { readonly options: ExampleOptions; }

    @Component({ selector: 'sui-example', styleUrl: './example.component.css' })
    /** Public example component. */
    export class Example<T = string> {
      /** Configures the example. */
      public readonly options = input<ExampleOptions<T>>({});

      /** Moves focus to the example. */
      public focus(options?: FocusOptions): void { void options; }
    }

    /** Replaces one rendered example item. */
    @Directive({ selector: 'ng-template[suiExampleItem]' })
    export class ExampleItemTemplate {
      public static ngTemplateContextGuard(
        _directive: ExampleItemTemplate,
        _context: unknown,
      ): _context is ExampleItemContext { return true; }
    }

    /** Secondary component without an options API. */
    @Component({ selector: 'sui-secondary' })
    export class Secondary {}

    /** @internal Not part of generated documentation. */
    @Component({ selector: 'sui-internal' })
    export class InternalComponent {}
  `,
  'sushi/src/lib/example/example.component.css': `
    :host {
      /** Space inside the example. */
      --sui-example-gap: 1rem;
      /** Text color when the example is hovered. */
      color: var(--sui-example-hover-color, currentColor);
    }
  `,
  'sushi/src/lib/hidden/hidden.component.ts': `
    declare function Component(metadata: unknown): ClassDecorator;
    /** This component is not exported. */
    @Component({ selector: 'sui-hidden' })
    export class HiddenComponent {}
  `,
  'playground/src/app/pages/example/.gitkeep': '',
  'sushi/src/styles/features/.gitkeep': '',
};

function writeFixture(root: string, file: string, content: string): void {
  const path: string = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function createFixture(): string {
  const root: string = mkdtempSync(join(tmpdir(), 'sushi-api-reference-'));
  fixtureRoots.push(root);
  for (const [file, content] of Object.entries(FIXTURE_FILES)) writeFixture(root, file, content);
  return root;
}

afterEach((): void => {
  let root: string | undefined = fixtureRoots.pop();
  while (root) {
    rmSync(root, { recursive: true, force: true });
    root = fixtureRoots.pop();
  }
});

function requireReference(result: GeneratedApi, name: string): ApiReferenceData {
  const reference: ApiReferenceData | undefined = result.references[name];
  if (!reference) throw new Error(`Expected generated API reference for ${name}.`);
  return reference;
}

describe('API reference exports', (): void => {
  it('documents exported components and omits internal or unexported symbols', (): void => {
    const result: GeneratedApi = generateApiReference(createFixture()).data;

    expect(Object.keys(result.references)).toEqual(['Example', 'Secondary']);
    expect(requireReference(result, 'Example').selector).toBe('sui-example');
    expect(result.referencesByRoute['example']).toEqual(['Example', 'Secondary']);
    expect(requireReference(result, 'Secondary').templates).toEqual([]);
    expect(requireReference(result, 'Secondary').types).toEqual([]);
  });
});

describe('API reference types and templates', (): void => {
  it('resolves generic, nested, template-context, and platform types', (): void => {
    const example: ApiReferenceData = requireReference(generateApiReference(createFixture()).data, 'Example');

    expect(example.declaration).toBe('Example<T = string>');
    expect(example.typeParameters).toEqual([{ name: 'T', constraint: null, defaultValue: 'string' }]);
    expect(example.templates).toContainEqual(expect.objectContaining({ name: 'suiExampleItem' }));
    expect(example.types.map((type): string => type.name)).toEqual([
      'DetailOptions',
      'ExampleItemContext',
      'ExampleOptions',
      'FocusOptions',
    ]);

    const focusOptions: ApiTypeDefinition | undefined = example.types.find((type): boolean => type.name === 'FocusOptions');

    expect(focusOptions?.members.map((member): string => member.name)).toContain('preventScroll');
    expect(focusOptions?.source).toBe('platform');

    const options: ApiTypeDefinition | undefined = example.types.find((type): boolean => type.name === 'ExampleOptions');

    expect(options?.source).toBe('library');
    expect(options?.typeParameters).toEqual([{ name: 'T', constraint: null, defaultValue: 'string' }]);
  });
});

describe('API reference CSS tokens', (): void => {
  it('includes declarations and fallback-only token references', (): void => {
    const example: ApiReferenceData = requireReference(generateApiReference(createFixture()).data, 'Example');

    expect(example.styles).toContainEqual(expect.objectContaining({ name: '--sui-example-gap', defaultValue: '1rem' }));
    expect(example.styles).toContainEqual(
      expect.objectContaining({ name: '--sui-example-hover-color', defaultValue: 'theme default' }),
    );
  });
});
