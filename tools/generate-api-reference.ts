import type { Dirent } from 'node:fs';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import type { Options as PrettierOptions } from 'prettier';
import prettier from 'prettier';
import ts from 'typescript';
import type {
  ApiMember,
  ApiMemberKind,
  ApiReferenceData,
  ApiTemplate,
} from '../playground/src/app/shared/api-reference/api-reference.types';

interface SourceReference extends Omit<ApiReferenceData, 'templates'> {
  readonly folder: string;
}

const root: string = resolve(process.cwd());
const sourceRoot: string = join(root, 'sushi/src/lib');
const outputFile: string = join(root, 'playground/src/app/generated/api-reference.generated.ts');

// Source discovery

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

// Angular metadata

function findSelector(node: ts.ClassDeclaration): string | null {
  const decorators: readonly ts.Decorator[] = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
  const decorator: ts.Decorator | undefined = decorators.find((item: ts.Decorator): boolean => {
    if (!ts.isCallExpression(item.expression)) return false;
    const name: string = item.expression.expression.getText();
    return name === 'Component' || name === 'Directive';
  });
  if (!decorator || !ts.isCallExpression(decorator.expression)) return null;

  const metadata: ts.Expression | undefined = decorator.expression.arguments[0];
  if (!metadata || !ts.isObjectLiteralExpression(metadata)) return null;

  const property: ts.ObjectLiteralElementLike | undefined = metadata.properties.find(
    (item: ts.ObjectLiteralElementLike): boolean => ts.isPropertyAssignment(item) && item.name.getText() === 'selector',
  );
  return property && ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : null;
}

function readJSDoc(node: ts.Node): string {
  return ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((comment: ts.JSDoc): string => ts.getTextOfJSDocComment(comment.comment) ?? '')
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

// Public API members

function isPublic(node: ts.Node & { readonly modifiers?: ts.NodeArray<ts.ModifierLike> }): boolean {
  return !node.modifiers?.some(
    (modifier: ts.ModifierLike): boolean =>
      modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
  );
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
  return initializer.arguments[0]?.getText() ?? 'undefined';
}

function readMethodType(method: ts.MethodDeclaration): string {
  const parameters: string = method.parameters
    .map((parameter: ts.ParameterDeclaration): string => parameter.getText())
    .join(', ');
  return `(${parameters}) => ${method.type?.getText() ?? 'void'}`;
}

function readDeclaredMembers(node: ts.ClassDeclaration): ApiMember[] {
  return node.members.flatMap((member: ts.ClassElement): ApiMember[] => {
    if (!member.name || !isPublic(member)) return [];
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

// Template markers and references

function readTemplateContext(node: ts.ClassDeclaration): string {
  const guard: ts.ClassElement | undefined = node.members.find(
    (member: ts.ClassElement): boolean => ts.isMethodDeclaration(member) && member.name.getText() === 'ngTemplateContextGuard',
  );
  if (!guard || !ts.isMethodDeclaration(guard) || !guard.type || !ts.isTypePredicateNode(guard.type)) return 'void';
  return guard.type.type?.getText() ?? 'void';
}

function collectReferences(): { readonly references: SourceReference[]; readonly templates: Map<string, ApiTemplate[]> } {
  const references: SourceReference[] = [];
  const templates: Map<string, ApiTemplate[]> = new Map<string, ApiTemplate[]>();
  const sources: readonly ts.SourceFile[] = program
    .getSourceFiles()
    .filter((file: ts.SourceFile): boolean => file.fileName.startsWith(sourceRoot));

  sources.forEach((source: ts.SourceFile): void => {
    source.statements.forEach((statement: ts.Statement): void => {
      if (!ts.isClassDeclaration(statement) || !statement.name) return;
      const selector: string | null = findSelector(statement);
      if (!selector) return;

      const folder: string = dirname(source.fileName);
      if (selector.startsWith('ng-template[')) {
        const markers: ApiTemplate[] = templates.get(folder) ?? [];
        markers.push({
          name: selector.slice('ng-template['.length, -1),
          context: readTemplateContext(statement),
          description: readJSDoc(statement),
        });
        templates.set(folder, markers);
        return;
      }

      references.push({
        className: statement.name.text,
        selector,
        folder,
        members: readMembers(statement),
      });
    });
  });

  return { references, templates };
}

function buildReferenceData(): Readonly<Record<string, ApiReferenceData>> {
  const collected: { readonly references: SourceReference[]; readonly templates: Map<string, ApiTemplate[]> } =
    collectReferences();
  const entries: [string, ApiReferenceData][] = collected.references
    .sort((first: SourceReference, second: SourceReference): number => first.className.localeCompare(second.className))
    .map((reference: SourceReference): [string, ApiReferenceData] => {
      const prefix: string = `sui${reference.className}`;
      const templates: readonly ApiTemplate[] = (collected.templates.get(reference.folder) ?? []).filter(
        (template: ApiTemplate): boolean => template.name.startsWith(prefix),
      );
      const data: ApiReferenceData = {
        className: reference.className,
        selector: reference.selector,
        members: reference.members,
        templates,
      };
      return [reference.className, data];
    });
  return Object.fromEntries(entries) as Readonly<Record<string, ApiReferenceData>>;
}

// Output

async function writeReferenceFile(): Promise<void> {
  const data: Readonly<Record<string, ApiReferenceData>> = buildReferenceData();
  const source: string =
    `/* Generated by tools/generate-api-reference.ts. Do not edit. */\n` +
    `import type { ApiReferenceData } from '../shared/api-reference/api-reference.types';\n\n` +
    `export const apiReference = ${JSON.stringify(data, null, 2)} as const satisfies Readonly<Record<string, ApiReferenceData>>;\n`;

  const options: PrettierOptions | null = await prettier.resolveConfig(outputFile);
  const formatted: string = await prettier.format(source, { ...options, parser: 'typescript' });

  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, formatted);
  console.log(`Generated ${Object.keys(data).length} API references in ${relative(root, outputFile)}.`);
}

writeReferenceFile().catch((error: unknown): never => {
  throw error;
});
