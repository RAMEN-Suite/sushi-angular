import type { Dirent } from 'node:fs';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import type { Options as PrettierOptions } from 'prettier';
import prettier from 'prettier';
import ts from 'typescript';
import type {
  ApiMember,
  ApiMemberKind,
  ApiReferenceData,
  ApiStyleProperty,
  ApiTemplate,
  ApiTypeDefinition,
  ApiTypeKind,
  ApiTypeMember,
} from '../playground/src/app/shared/api-reference/api-reference.types';

interface SourceReference {
  readonly className: string;
  readonly declaration: string;
  readonly selector: string;
  readonly description: string;
  readonly folder: string;
  readonly members: readonly ApiMember[];
  readonly styles: readonly ApiStyleProperty[];
}

function readClassDeclaration(node: ts.ClassDeclaration): string {
  const className: string = node.name?.text ?? '';
  const parameters: string =
    node.typeParameters?.map((parameter: ts.TypeParameterDeclaration): string => parameter.getText()).join(', ') ?? '';
  return parameters ? `${className}<${parameters}>` : className;
}

interface CollectedApi {
  readonly references: SourceReference[];
  readonly templates: Map<string, ApiTemplate[]>;
  readonly types: ReadonlyMap<string, ApiTypeDefinition>;
  readonly typesByClass: ReadonlyMap<string, readonly string[]>;
}

type ApiTypeNode = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration;

const root: string = resolve(process.cwd());
const sourceRoot: string = join(root, 'sushi/src/lib');
const outputFile: string = join(root, 'playground/src/app/generated/api-reference.generated.ts');
const sharedStyleFiles: Readonly<Record<string, readonly string[]>> = {
  autocomplete: ['sushi/src/styles/features/selection.styles.css'],
  listbox: ['sushi/src/styles/features/selection.styles.css'],
  'multi-select': ['sushi/src/styles/features/selection.styles.css'],
  'order-list': ['sushi/src/styles/features/selection.styles.css'],
  select: ['sushi/src/styles/features/selection.styles.css'],
};
const sharedStyleFilesByClass: Readonly<Record<string, readonly string[]>> = {
  Dialog: ['sushi/src/styles/features/dialog.styles.css'],
  Divider: ['sushi/src/styles/features/divider.styles.css'],
  Kbd: ['sushi/src/styles/features/kbd.styles.css'],
  Message: ['sushi/src/styles/features/message.styles.css'],
  Navbar: ['sushi/src/styles/features/navbar.styles.css'],
  Progress: ['sushi/src/styles/features/progress.styles.css'],
  Spinner: ['sushi/src/styles/features/spinner.styles.css'],
  Status: ['sushi/src/styles/features/status.styles.css'],
};

function findSourceFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry: Dirent): string[] => {
    const file: string = join(folder, entry.name);
    if (entry.isDirectory()) return findSourceFiles(file);
    return extname(file) === '.ts' && !file.endsWith('.spec.ts') ? [file] : [];
  });
}

const sourceFiles: string[] = findSourceFiles(sourceRoot);
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
};
const program: ts.Program = ts.createProgram(sourceFiles, compilerOptions);
const checker: ts.TypeChecker = program.getTypeChecker();

function findAngularMetadata(node: ts.ClassDeclaration): ts.ObjectLiteralExpression | null {
  const decorators: readonly ts.Decorator[] = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
  const decorator: ts.Decorator | undefined = decorators.find((item: ts.Decorator): boolean => {
    if (!ts.isCallExpression(item.expression)) return false;
    const name: string = item.expression.expression.getText();
    return name === 'Component' || name === 'Directive';
  });
  if (!decorator || !ts.isCallExpression(decorator.expression)) return null;

  const metadata: ts.Expression | undefined = decorator.expression.arguments.at(0);
  return metadata && ts.isObjectLiteralExpression(metadata) ? metadata : null;
}

function findSelector(node: ts.ClassDeclaration): string | null {
  const metadata: ts.ObjectLiteralExpression | null = findAngularMetadata(node);
  if (!metadata) return null;

  const property: ts.ObjectLiteralElementLike | undefined = metadata.properties.find(
    (item: ts.ObjectLiteralElementLike): boolean => ts.isPropertyAssignment(item) && item.name.getText() === 'selector',
  );
  return property && ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : null;
}

function isInjectable(node: ts.ClassDeclaration): boolean {
  if (node.getSourceFile().fileName.includes('/internal/')) return false;
  const decorators: readonly ts.Decorator[] = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
  return decorators.some(
    (decorator: ts.Decorator): boolean =>
      ts.isCallExpression(decorator.expression) && decorator.expression.expression.getText() === 'Injectable',
  );
}

function findStyleFile(node: ts.ClassDeclaration): string | null {
  const metadata: ts.ObjectLiteralExpression | null = findAngularMetadata(node);
  if (!metadata) return null;

  const property: ts.ObjectLiteralElementLike | undefined = metadata.properties.find(
    (item: ts.ObjectLiteralElementLike): boolean => ts.isPropertyAssignment(item) && item.name.getText() === 'styleUrl',
  );
  if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) return null;

  const file: string = resolve(dirname(node.getSourceFile().fileName), property.initializer.text);
  return existsSync(file) ? file : null;
}

function readStyleProperties(node: ts.ClassDeclaration): readonly ApiStyleProperty[] {
  const folder: string = basename(dirname(node.getSourceFile().fileName));
  const className: string = node.name?.text ?? '';
  const componentStyle: string | null = findStyleFile(node);
  const files: readonly string[] = [
    ...(componentStyle ? [componentStyle] : []),
    ...(sharedStyleFiles[folder] ?? []).map((file: string): string => join(root, file)),
    ...(sharedStyleFilesByClass[className] ?? []).map((file: string): string => join(root, file)),
  ];
  if (files.length === 0) return [];

  const css: string = files.map((file: string): string => readFileSync(file, 'utf8')).join('\n');
  const pattern: RegExp = /\/\*\*([\s\S]*?)\*\/\s*(--sui-[\w-]+)\s*:\s*([^;]+);/gu;
  const fallbackPattern: RegExp = /\/\*\*([\s\S]*?)\*\/[\s\S]*?var\((--sui-[\w-]+),/gu;
  const examplePattern: RegExp = /^@example\s+(.+)$/mu;
  const matches: readonly RegExpMatchArray[] = [...css.matchAll(pattern), ...css.matchAll(fallbackPattern)];
  const properties: ApiStyleProperty[] = matches.map((match: RegExpMatchArray): ApiStyleProperty => {
    const documentation: string = match[1].replaceAll(/^\s*\* ?/gmu, '').trim();
    const example: RegExpExecArray | null = examplePattern.exec(documentation);
    const declaredDefault: string | undefined = match.at(3);
    return {
      name: match[2],
      defaultValue: declaredDefault?.trim() ?? 'theme default',
      exampleValue: example?.[1]?.trim() ?? null,
      description: documentation
        .replaceAll(/^@\w+.*$/gmu, '')
        .replaceAll(/\s+/g, ' ')
        .trim(),
    };
  });
  return properties.filter(
    (property: ApiStyleProperty, index: number): boolean =>
      properties.findIndex((candidate: ApiStyleProperty): boolean => candidate.name === property.name) === index,
  );
}

function readJSDoc(node: ts.Node): string {
  const description: string = ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((comment: ts.JSDoc): string => ts.getTextOfJSDocComment(comment.comment) ?? '')
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
  if (description || !ts.isClassDeclaration(node)) return description;

  const source: string = node.getText();
  const classStart: number = source.indexOf('export class');
  if (classStart < 0) return '';

  const comments: readonly RegExpMatchArray[] = [...source.slice(0, classStart).matchAll(/\/\*\*([\s\S]*?)\*\//gu)];
  const comment: string = comments.at(-1)?.[1] ?? '';
  return comment
    .replaceAll(/^\s*\* ?/gmu, '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function isPublic(node: ts.Node & { readonly modifiers?: ts.NodeArray<ts.ModifierLike> }): boolean {
  return !node.modifiers?.some(
    (modifier: ts.ModifierLike): boolean =>
      modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
  );
}

function isInternal(node: ts.Node): boolean {
  return ts.getJSDocTags(node).some((tag: ts.JSDocTag): boolean => tag.tagName.text === 'internal');
}

function readSignalKind(initializer: ts.Expression | undefined): ApiMemberKind | null {
  if (!initializer || !ts.isCallExpression(initializer)) return null;
  const name: string = initializer.expression.getText();
  if (name === 'input' || name === 'input.required') return 'input';
  if (name === 'model' || name === 'model.required') return 'model';
  if (name === 'output') return 'output';
  return null;
}

function readSignalType(property: ts.PropertyDeclaration): string {
  if (property.type && ts.isTypeReferenceNode(property.type) && property.type.typeArguments?.[0]) {
    return property.type.typeArguments[0].getText();
  }
  return checker.typeToString(checker.getTypeAtLocation(property));
}

function readDefaultValue(property: ts.PropertyDeclaration, kind: ApiMemberKind): string | null {
  const initializer: ts.Expression | undefined = property.initializer;
  if (!initializer || !ts.isCallExpression(initializer) || kind === 'output') return null;
  if (initializer.expression.getText().endsWith('.required')) return 'required';
  return initializer.arguments.at(0)?.getText() ?? 'undefined';
}

function readMethodType(method: ts.MethodDeclaration): string {
  const parameters: string = method.parameters
    .map((parameter: ts.ParameterDeclaration): string => parameter.getText())
    .join(', ');
  return `(${parameters}) => ${method.type?.getText() ?? 'void'}`;
}

function readDeclaredMembers(node: ts.ClassDeclaration): ApiMember[] {
  return node.members.flatMap((member: ts.ClassElement): ApiMember[] => {
    if (!member.name || !isPublic(member) || isInternal(member)) return [];
    const name: string = member.name.getText();

    if (ts.isPropertyDeclaration(member)) {
      const kind: ApiMemberKind | null = readSignalKind(member.initializer);
      if (!kind) return [];
      return [
        {
          name,
          kind,
          type: readSignalType(member),
          defaultValue: readDefaultValue(member, kind),
          description: readJSDoc(member),
        },
      ];
    }

    const isMethod: boolean = ts.isMethodDeclaration(member);
    const isStatic: boolean = Boolean(
      ts.canHaveModifiers(member) &&
      ts.getModifiers(member)?.some((modifier: ts.Modifier): boolean => modifier.kind === ts.SyntaxKind.StaticKeyword),
    );
    if (!isMethod || isStatic) return [];

    const method: ts.MethodDeclaration = member as ts.MethodDeclaration;
    return [
      {
        name,
        kind: 'method',
        type: readMethodType(method),
        defaultValue: null,
        description: readJSDoc(method),
      },
    ];
  });
}

function findBaseClass(node: ts.ClassDeclaration): ts.ClassDeclaration | null {
  const clause: ts.HeritageClause | undefined = node.heritageClauses?.find(
    (item: ts.HeritageClause): boolean => item.token === ts.SyntaxKind.ExtendsKeyword,
  );
  const heritage: ts.ExpressionWithTypeArguments | undefined = clause?.types[0];
  if (!heritage) return null;

  const symbol: ts.Symbol | undefined = checker.getSymbolAtLocation(heritage.expression);
  const target: ts.Symbol | undefined = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  return target?.declarations?.find(ts.isClassDeclaration) ?? null;
}

function readMembers(node: ts.ClassDeclaration): ApiMember[] {
  const members: ApiMember[] = [];
  let current: ts.ClassDeclaration | null = node;

  while (current) {
    readDeclaredMembers(current).forEach((member: ApiMember): void => {
      const exists: boolean = members.some((item: ApiMember): boolean => item.name === member.name);
      if (!exists) members.push(member);
    });
    current = findBaseClass(current);
  }
  return members;
}

function readTemplateContext(node: ts.ClassDeclaration): string {
  const guard: ts.ClassElement | undefined = node.members.find(
    (member: ts.ClassElement): boolean => ts.isMethodDeclaration(member) && member.name.getText() === 'ngTemplateContextGuard',
  );
  if (guard && ts.isMethodDeclaration(guard) && guard.type && ts.isTypePredicateNode(guard.type)) {
    return guard.type.type?.getText() ?? 'void';
  }

  const context: ts.ClassElement | undefined = node.members.find(
    (member: ts.ClassElement): boolean => ts.isPropertyDeclaration(member) && member.name.getText() === 'ngTemplateContextType',
  );
  return context && ts.isPropertyDeclaration(context) ? (context.type?.getText() ?? 'void') : 'void';
}

function isExported(node: ts.Node): boolean {
  return Boolean(
    ts.canHaveModifiers(node) &&
    ts.getModifiers(node)?.some((modifier: ts.Modifier): boolean => modifier.kind === ts.SyntaxKind.ExportKeyword),
  );
}

function isApiTypeNode(node: ts.Statement): node is ApiTypeNode {
  return ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node);
}

function readTypeKind(node: ApiTypeNode): ApiTypeKind {
  if (ts.isInterfaceDeclaration(node)) return 'interface';
  if (ts.isTypeAliasDeclaration(node)) return 'type';
  return 'enum';
}

function readTypeDeclaration(node: ApiTypeNode): string {
  if (ts.isTypeAliasDeclaration(node)) {
    const parameters: string =
      node.typeParameters?.map((item: ts.TypeParameterDeclaration): string => item.getText()).join(', ') ?? '';
    const suffix: string = parameters ? `<${parameters}>` : '';
    return `type ${node.name.text}${suffix} = ${node.type.getText()};`;
  }

  if (ts.isEnumDeclaration(node)) {
    const members: string = node.members.map((member: ts.EnumMember): string => `  ${member.getText()},`).join('\n');
    return `enum ${node.name.text} {\n${members}\n}`;
  }

  const parameters: string =
    node.typeParameters?.map((item: ts.TypeParameterDeclaration): string => item.getText()).join(', ') ?? '';
  const suffix: string = parameters ? `<${parameters}>` : '';
  const heritage: string = node.heritageClauses?.map((clause: ts.HeritageClause): string => clause.getText()).join(' ') ?? '';
  const members: string = node.members.map((member: ts.TypeElement): string => `  ${member.getText()}`).join('\n');
  return `interface ${node.name.text}${suffix}${heritage ? ` ${heritage}` : ''} {\n${members}\n}`;
}

function readTypeMembers(node: ApiTypeNode): readonly ApiTypeMember[] {
  if (!ts.isInterfaceDeclaration(node)) return [];

  return node.members.flatMap((member: ts.TypeElement): readonly ApiTypeMember[] => {
    if (!ts.isPropertySignature(member) || !member.type) return [];
    return [
      {
        name: member.name.getText(),
        type: member.type.getText(),
        optional: Boolean(member.questionToken),
        description: readJSDoc(member),
      },
    ];
  });
}

function readTypeDefinition(statement: ts.Statement): ApiTypeDefinition | null {
  if (!isApiTypeNode(statement) || !isExported(statement) || isInternal(statement)) return null;

  return {
    name: statement.name.text,
    kind: readTypeKind(statement),
    declaration: readTypeDeclaration(statement),
    description: readJSDoc(statement),
    members: readTypeMembers(statement),
  };
}

function collectType(
  statement: ts.Statement,
  className: string,
  types: Map<string, ApiTypeDefinition>,
  typesByClass: Map<string, string[]>,
): void {
  const type: ApiTypeDefinition | null = readTypeDefinition(statement);
  if (!type || types.has(type.name)) return;
  types.set(type.name, type);
  typesByClass.set(className, [...(typesByClass.get(className) ?? []), type.name]);
}

function collectApi(): CollectedApi {
  const references: SourceReference[] = [];
  const templates: Map<string, ApiTemplate[]> = new Map<string, ApiTemplate[]>();
  const types: Map<string, ApiTypeDefinition> = new Map<string, ApiTypeDefinition>();
  const typesByClass: Map<string, string[]> = new Map<string, string[]>();
  const sources: readonly ts.SourceFile[] = program
    .getSourceFiles()
    .filter((file: ts.SourceFile): boolean => file.fileName.startsWith(sourceRoot));

  sources.forEach((source: ts.SourceFile): void => {
    const folder: string = dirname(source.fileName);
    const typeOwner: string = featureClassName(basename(source.fileName).split('.')[0]);
    source.statements.forEach((statement: ts.Statement): void => {
      collectType(statement, typeOwner, types, typesByClass);

      if (!ts.isClassDeclaration(statement) || !statement.name || isInternal(statement)) return;
      const selector: string | null = findSelector(statement);
      if (!selector && !isInjectable(statement)) return;

      if (selector?.startsWith('ng-template[')) {
        const markers: ApiTemplate[] = templates.get(folder) ?? [];
        markers.push({
          name: selector.slice('ng-template['.length, -1),
          context: readTemplateContext(statement),
          description: readJSDoc(statement),
          members: readMembers(statement),
        });
        templates.set(folder, markers);
        return;
      }

      references.push({
        className: statement.name.text,
        declaration: readClassDeclaration(statement),
        selector: selector ?? 'injectable',
        description: readJSDoc(statement),
        folder,
        members: readMembers(statement),
        styles: readStyleProperties(statement),
      });
    });
  });

  return { references, templates, types, typesByClass };
}

function findReferencedTypes(
  members: readonly ApiMember[],
  templates: readonly ApiTemplate[],
  definitions: ReadonlyMap<string, ApiTypeDefinition>,
  includedNames: readonly string[] = [],
): readonly ApiTypeDefinition[] {
  const values: string[] = [
    ...members.map((member: ApiMember): string => member.type),
    ...templates.map((template: ApiTemplate): string => template.context),
    ...templates.flatMap((template: ApiTemplate): readonly string[] =>
      template.members.map((member: ApiMember): string => member.type),
    ),
  ];
  const found: Map<string, ApiTypeDefinition> = new Map<string, ApiTypeDefinition>();
  includedNames.forEach((name: string): void => {
    const definition: ApiTypeDefinition | undefined = definitions.get(name);
    if (!definition) return;
    found.set(name, definition);
    values.push(definition.declaration);
  });

  let index: number = 0;
  while (index < values.length) {
    const value: string = values[index];
    index += 1;
    const names: readonly string[] = value.match(/\b[A-Za-z_$][\w$]*\b/gu) ?? [];
    names.forEach((name: string): void => {
      const definition: ApiTypeDefinition | undefined = definitions.get(name);
      if (!definition || found.has(name)) return;
      found.set(name, definition);
      values.push(definition.declaration);
    });
  }

  return [...found.values()].sort((first: ApiTypeDefinition, second: ApiTypeDefinition): number =>
    first.name.localeCompare(second.name),
  );
}

function featureClassName(folder: string): string {
  return basename(folder)
    .split('-')
    .map((part: string): string => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
}

function buildReferenceData(): Readonly<Record<string, ApiReferenceData>> {
  const collected: CollectedApi = collectApi();
  const entries: [string, ApiReferenceData][] = collected.references
    .sort((first: SourceReference, second: SourceReference): number => first.className.localeCompare(second.className))
    .map((reference: SourceReference): [string, ApiReferenceData] => {
      const prefix: string = `sui${reference.className}`;
      const folderReferences: readonly SourceReference[] = collected.references.filter(
        (item: SourceReference): boolean => item.folder === reference.folder,
      );
      const folderTemplates: readonly ApiTemplate[] = collected.templates.get(reference.folder) ?? [];
      const templates: readonly ApiTemplate[] =
        folderReferences.length === 1
          ? folderTemplates
          : folderTemplates.filter((template: ApiTemplate): boolean => template.name.startsWith(prefix));
      const featureTypes: readonly string[] = collected.typesByClass.get(reference.className) ?? [];
      const data: ApiReferenceData = {
        className: reference.className,
        declaration: reference.declaration,
        selector: reference.selector,
        description: reference.description,
        members: reference.members,
        templates,
        types: findReferencedTypes(reference.members, templates, collected.types, featureTypes),
        styles: reference.styles,
      };
      return [reference.className, data];
    });
  const references: Readonly<Record<string, ApiReferenceData>> = Object.fromEntries(entries);
  return references;
}

function validateDocumentation(data: Readonly<Record<string, ApiReferenceData>>): void {
  const missing: string[] = [];
  Object.values(data).forEach((reference: ApiReferenceData): void => {
    if (!reference.description) missing.push(reference.className);
    reference.members.forEach((member: ApiMember): void => {
      if (!member.description) missing.push(`${reference.className}.${member.name}`);
    });
    reference.templates.forEach((template: ApiTemplate): void => {
      if (!template.description) missing.push(`${reference.className}.${template.name}`);
    });
    reference.types.forEach((type: ApiTypeDefinition): void => {
      if (!type.description) missing.push(`${reference.className}.${type.name}`);
    });
    reference.styles.forEach((style: ApiStyleProperty): void => {
      if (!style.description) missing.push(`${reference.className}.${style.name}`);
    });
  });
  if (missing.length) console.warn(`Missing public API documentation: ${missing.join(', ')}`);
}

async function writeReferenceFile(): Promise<void> {
  const data: Readonly<Record<string, ApiReferenceData>> = buildReferenceData();
  validateDocumentation(data);
  const members: string = Object.keys(data)
    .map((name: string): string => `readonly ${name}: ApiReferenceData;`)
    .join('\n');
  const source: string =
    `/* Generated by tools/generate-api-reference.ts. Do not edit. */\n` +
    `import type { ApiReferenceData } from '../shared/api-reference/api-reference.types';\n\n` +
    `export const apiReference: Readonly<{${members}}> = ${JSON.stringify(data, null, 2)} as const;\n`;

  const options: PrettierOptions | null = await prettier.resolveConfig(outputFile);
  const formatted: string = await prettier.format(source, { ...options, parser: 'typescript' });

  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, formatted);
  console.log(`Generated ${Object.keys(data).length} API references in ${relative(root, outputFile)}.`);
}

writeReferenceFile().catch((error: unknown): never => {
  throw error;
});
