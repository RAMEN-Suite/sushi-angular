import type { Dirent } from 'node:fs';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import postcss from 'postcss';
import type { Comment, Root } from 'postcss';
import ts from 'typescript';
import type {
  ApiMember,
  ApiReferenceData,
  ApiTemplate,
  ApiTypeDefinition,
} from '../../playground/src/app/shared/api-reference/api-reference.types';
import { ApiSourceReader, isInjectable, isInternal, readComponentStyles } from './source-reader';
import type { ApiTemplateDeclaration, ApiTypeDeclaration } from './source-reader';
import type { GeneratedApi } from './generated-file';

export interface ApiReferencePaths {
  readonly outputFile: string;
  readonly root: string;
  readonly sourceRoot: string;
}

export interface ApiReferenceGeneration {
  readonly data: GeneratedApi;
  readonly paths: ApiReferencePaths;
}

interface ComponentReference {
  readonly className: string;
  readonly declaration: string;
  readonly selector: string;
  readonly description: string;
  readonly folder: string;
  readonly route: string;
  readonly members: readonly ApiMember[];
  readonly referencedTypes: readonly string[];
  readonly styles: ApiReferenceData['styles'];
  readonly typeParameters: ApiReferenceData['typeParameters'];
}

interface Collection {
  readonly references: ComponentReference[];
  readonly templates: Map<string, ApiTemplate[]>;
  readonly types: Map<string, ApiTypeDefinition>;
  readonly typeDependencies: Map<string, readonly string[]>;
  readonly templateTypeNames: Map<ApiTemplate, readonly string[]>;
  readonly platformTypes: ReadonlyMap<string, ts.Statement>;
}

// Workspace conventions. Changing the project layout should only require edits here.
const SOURCE_DIRECTORY: string = 'sushi/src/lib';
const TYPESCRIPT_CONFIG_FILE: string = 'sushi/tsconfig.lib.json';
const PUBLIC_API_FILE: string = 'sushi/src/public-api.ts';
const PAGE_DIRECTORY: string = 'playground/src/app/pages';
const STYLE_DIRECTORY: string = 'sushi/src/styles/features';
const GENERATED_FILE: string = 'playground/src/app/generated/api-reference.generated.ts';
const STYLE_FILE_SUFFIX: string = '.styles.css';
const TEMPLATE_SELECTOR_PREFIX: string = 'ng-template[';
const STYLE_ROUTE_DIRECTIVE: string = '@sui-docs';
const PLATFORM_TYPE_EXCLUSIONS: ReadonlySet<string> = new Set<string>([
  'Array',
  'Map',
  'Promise',
  'ReadonlyArray',
  'Record',
  'Set',
]);

// Workspace discovery

export function createApiReferencePaths(root: string): ApiReferencePaths {
  return {
    root,
    sourceRoot: join(root, SOURCE_DIRECTORY),
    outputFile: join(root, GENERATED_FILE),
  };
}

function toKebabCase(value: string): string {
  return value
    .replaceAll(/([a-z0-9])([A-Z])/gu, '$1-$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/gu, '$1-$2')
    .toLowerCase();
}

function createRouteResolver(root: string): (className: string, folder: string) => string {
  const pageEntries: readonly Dirent[] = readdirSync(join(root, PAGE_DIRECTORY), { withFileTypes: true });
  const routes: Set<string> = new Set<string>();
  for (const entry of pageEntries) {
    if (entry.isDirectory()) routes.add(entry.name);
  }

  return (className: string, folder: string): string => {
    const classRoute: string = toKebabCase(className);
    return routes.has(classRoute) ? classRoute : basename(folder);
  };
}

function discoverGlobalStyles(root: string): ReadonlyMap<string, readonly string[]> {
  const filesByRoute: Map<string, string[]> = new Map<string, string[]>();
  const styleFolder: string = join(root, STYLE_DIRECTORY);
  for (const entry of readdirSync(styleFolder, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(STYLE_FILE_SUFFIX)) continue;

    const file: string = join(styleFolder, entry.name);
    const stylesheet: Root = postcss.parse(readFileSync(file, 'utf8'), { from: file });
    const routes: readonly string[] = [basename(entry.name, STYLE_FILE_SUFFIX), ...readAdditionalStyleRoutes(stylesheet)];

    for (const route of routes) filesByRoute.set(route, [...(filesByRoute.get(route) ?? []), file]);
  }

  return filesByRoute;
}

function readAdditionalStyleRoutes(stylesheet: Root): readonly string[] {
  for (const node of stylesheet.nodes) {
    if (node.type !== 'comment') continue;

    const comment: Comment = node;
    if (!comment.text.startsWith(STYLE_ROUTE_DIRECTIVE)) continue;

    return comment.text.slice(STYLE_ROUTE_DIRECTIVE.length).trim().split(/\s+/u);
  }

  return [];
}

// TypeScript program and source collection

function loadProgram(root: string): ts.Program {
  const configFile: string = join(root, TYPESCRIPT_CONFIG_FILE);
  const config: ts.ParsedCommandLine | undefined = ts.getParsedCommandLineOfConfigFile(
    configFile,
    { noEmit: true },
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic: ts.Diagnostic): never => {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    },
  );

  if (!config) throw new Error(`Could not read TypeScript configuration: ${configFile}`);

  return ts.createProgram(config.fileNames, config.options);
}

function resolveAlias(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function findPublicDeclarations(root: string, program: ts.Program, checker: ts.TypeChecker): readonly ts.Declaration[] {
  const publicApiFile: string = join(root, PUBLIC_API_FILE);
  const publicApi: ts.SourceFile | undefined = program.getSourceFile(publicApiFile);
  if (!publicApi) throw new Error(`Public API source not found: ${publicApiFile}`);

  const moduleSymbol: ts.Symbol | undefined = checker.getSymbolAtLocation(publicApi);
  if (!moduleSymbol) throw new Error(`Public API module has no TypeScript symbol: ${publicApiFile}`);

  const declarations: ts.Declaration[] = [];
  for (const exportedSymbol of checker.getExportsOfModule(moduleSymbol)) {
    const symbol: ts.Symbol = resolveAlias(exportedSymbol, checker);
    declarations.push(...(symbol.declarations ?? []));
  }

  return declarations;
}

function findPlatformTypes(program: ts.Program): ReadonlyMap<string, ts.Statement> {
  const declarations: Map<string, ts.Statement> = new Map<string, ts.Statement>();
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile || !/^lib\..+\.d\.ts$/u.test(basename(sourceFile.fileName))) continue;

    for (const statement of sourceFile.statements) {
      if (!ts.isInterfaceDeclaration(statement) && !ts.isTypeAliasDeclaration(statement) && !ts.isEnumDeclaration(statement)) {
        continue;
      }

      if (!declarations.has(statement.name.text)) declarations.set(statement.name.text, statement);
    }
  }

  return declarations;
}

function collectTemplate(node: ts.ClassDeclaration, selector: string, reader: ApiSourceReader, collection: Collection): void {
  const folder: string = dirname(node.getSourceFile().fileName);
  const declaration: ApiTemplateDeclaration = reader.readTemplate(node, selector);

  collection.templates.set(folder, [...(collection.templates.get(folder) ?? []), declaration.template]);
  collection.templateTypeNames.set(declaration.template, declaration.referencedTypes);
}

function collectType(statement: ts.Statement, collection: Collection, reader: ApiSourceReader): void {
  const type: ApiTypeDeclaration | null = reader.readType(statement);
  if (!type || collection.types.has(type.definition.name)) return;

  collection.types.set(type.definition.name, type.definition);
  collection.typeDependencies.set(type.definition.name, type.referencedTypes);
}

function collectClass(
  statement: ts.Statement,
  folder: string,
  collection: Collection,
  reader: ApiSourceReader,
  resolveRoute: (className: string, folder: string) => string,
  stylesByRoute: ReadonlyMap<string, readonly string[]>,
): void {
  if (!ts.isClassDeclaration(statement) || !statement.name || isInternal(statement)) return;

  const declaration: ReturnType<ApiSourceReader['readClass']> = reader.readClass(statement);
  const selector: string | null = declaration.selector;

  if (!selector && !isInjectable(statement)) return;

  if (selector?.startsWith(TEMPLATE_SELECTOR_PREFIX)) {
    collectTemplate(statement, selector, reader, collection);
    return;
  }

  const route: string = resolveRoute(statement.name.text, folder);
  collection.references.push({
    className: statement.name.text,
    declaration: declaration.declaration,
    selector: selector ?? 'injectable',
    description: declaration.description,
    folder,
    route,
    members: declaration.members,
    referencedTypes: declaration.referencedTypes,
    styles: readComponentStyles(statement, route, stylesByRoute),
    typeParameters: declaration.typeParameters,
  });
}

function collectDeclarations(
  declarations: readonly ts.Declaration[],
  collection: Collection,
  reader: ApiSourceReader,
  resolveRoute: (className: string, folder: string) => string,
  stylesByRoute: ReadonlyMap<string, readonly string[]>,
): void {
  for (const declaration of declarations) {
    if (!ts.isStatement(declaration)) continue;
    const sourceFile: ts.SourceFile = declaration.getSourceFile();
    const folder: string = dirname(sourceFile.fileName);

    collectType(declaration, collection, reader);
    collectClass(declaration, folder, collection, reader, resolveRoute, stylesByRoute);
  }
}

// Final API model

function templatesFor(reference: ComponentReference, collection: Collection): readonly ApiTemplate[] {
  const templates: readonly ApiTemplate[] = collection.templates.get(reference.folder) ?? [];
  const siblings: readonly ComponentReference[] = collection.references.filter(
    (item: ComponentReference): boolean => item.folder === reference.folder,
  );
  if (siblings.length === 1) return templates;

  const prefix: string = `sui${reference.className}`;
  return templates.filter((template: ApiTemplate): boolean => template.name.startsWith(prefix));
}

function typesFor(names: readonly string[], collection: Collection, reader: ApiSourceReader): readonly ApiTypeDefinition[] {
  const definitions: Map<string, ApiTypeDefinition> = new Map<string, ApiTypeDefinition>(collection.types);
  for (const name of names) {
    if (definitions.has(name) || PLATFORM_TYPE_EXCLUSIONS.has(name)) continue;

    const statement: ts.Statement | undefined = collection.platformTypes.get(name);
    const declaration: ApiTypeDeclaration | null = statement ? reader.readType(statement, false) : null;
    if (!declaration) continue;

    definitions.set(name, {
      ...declaration.definition,
      source: 'platform',
      description: 'Browser platform type used by this public API.',
    });
  }

  return reader.findReferencedTypes(names, definitions, collection.typeDependencies);
}

function createReferenceData(reference: ComponentReference, collection: Collection, reader: ApiSourceReader): ApiReferenceData {
  const templates: readonly ApiTemplate[] = templatesFor(reference, collection);
  const referencedNames: readonly string[] = [
    ...reference.referencedTypes,
    ...templates.flatMap((template: ApiTemplate): readonly string[] => collection.templateTypeNames.get(template) ?? []),
  ];

  return {
    className: reference.className,
    declaration: reference.declaration,
    selector: reference.selector,
    description: reference.description,
    members: reference.members,
    templates,
    typeParameters: reference.typeParameters,
    types: typesFor(referencedNames, collection, reader),
    styles: reference.styles,
  };
}

function groupByRoute(references: readonly ComponentReference[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const reference of references) {
    groups[reference.route] = [...(groups[reference.route] ?? []), reference.className];
  }

  for (const [route, names] of Object.entries(groups)) {
    names.sort((first: string, second: string): number => {
      const primaryDifference: number = Number(toKebabCase(second) === route) - Number(toKebabCase(first) === route);
      return primaryDifference || first.localeCompare(second);
    });
  }

  return groups;
}

/** Generates all API documentation data for one workspace. */
export function generateApiReference(root: string = resolve(process.cwd())): ApiReferenceGeneration {
  const program: ts.Program = loadProgram(root);
  const checker: ts.TypeChecker = program.getTypeChecker();
  const reader: ApiSourceReader = new ApiSourceReader(checker);
  const collection: Collection = {
    references: [],
    templates: new Map(),
    types: new Map(),
    typeDependencies: new Map(),
    templateTypeNames: new Map(),
    platformTypes: findPlatformTypes(program),
  };

  const resolveRoute: (className: string, folder: string) => string = createRouteResolver(root);
  const stylesByRoute: ReadonlyMap<string, readonly string[]> = discoverGlobalStyles(root);
  const declarations: readonly ts.Declaration[] = findPublicDeclarations(root, program, checker);

  collectDeclarations(declarations, collection, reader, resolveRoute, stylesByRoute);
  collection.references.sort((first, second): number => first.className.localeCompare(second.className));

  const entries: readonly [string, ApiReferenceData][] = collection.references.map((reference): [string, ApiReferenceData] => [
    reference.className,
    createReferenceData(reference, collection, reader),
  ]);

  return {
    paths: createApiReferencePaths(root),
    data: {
      references: Object.fromEntries(entries),
      referencesByRoute: groupByRoute(collection.references),
    },
  };
}
