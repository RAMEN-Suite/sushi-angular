import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import postcss from 'postcss';
import type { ChildNode, Comment, Declaration, Root } from 'postcss';
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
  ApiTypeParameter,
} from '../../playground/src/app/shared/api-reference/api-reference.types';

interface ApiClassDeclaration {
  readonly declaration: string;
  readonly description: string;
  readonly members: readonly ApiMember[];
  readonly referencedTypes: readonly string[];
  readonly selector: string | null;
  readonly typeParameters: readonly ApiTypeParameter[];
}

export interface ApiTypeDeclaration {
  readonly definition: ApiTypeDefinition;
  readonly referencedTypes: readonly string[];
}

export interface ApiTemplateDeclaration {
  readonly template: ApiTemplate;
  readonly referencedTypes: readonly string[];
}

type ApiTypeNode = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration;
type TypeParameterOwner = ts.ClassDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

// Syntax conventions understood by the reader. Keep framework-specific names centralized here.
const ANGULAR_DECLARATION_DECORATORS: ReadonlySet<string> = new Set<string>(['Component', 'Directive']);
const INJECTABLE_DECORATOR: string = 'Injectable';
const SELECTOR_METADATA_PROPERTY: string = 'selector';
const STYLE_URL_METADATA_PROPERTY: string = 'styleUrl';
const TEMPLATE_SELECTOR_PREFIX: string = 'ng-template[';
const TEMPLATE_CONTEXT_GUARD: string = 'ngTemplateContextGuard';
const TEMPLATE_CONTEXT_PROPERTY: string = 'ngTemplateContextType';
const INTERNAL_JSDOC_TAG: string = 'internal';
const JSDOC_OPENING: string = '/**';
const SIGNAL_KINDS: ReadonlyMap<string, ApiMemberKind> = new Map<string, ApiMemberKind>([
  ['input', 'input'],
  ['input.required', 'input'],
  ['model', 'model'],
  ['model.required', 'model'],
  ['output', 'output'],
]);
const STYLE_PROPERTY_PREFIX: string = '--sui-';
const STYLE_REFERENCE_PATTERN: RegExp = /var\((--sui-[\w-]+),/u;
const STYLE_EXAMPLE_PATTERN: RegExp = /^@example\s+(.+)$/mu;

// Style token documentation

function precedingDocumentation(declaration: Declaration): string | null {
  const previous: ChildNode | undefined = declaration.prev();
  if (previous?.type !== 'comment') return null;

  const comment: Comment = previous;
  return comment.text.startsWith('*') ? comment.text.slice(1).trim() : null;
}

function parseStyleProperty(name: string, defaultValue: string, documentation: string): ApiStyleProperty {
  const example: RegExpExecArray | null = STYLE_EXAMPLE_PATTERN.exec(documentation);

  return {
    name,
    defaultValue,
    exampleValue: example?.[1]?.trim() ?? null,
    description: documentation
      .replaceAll(/^@\w+.*$/gmu, '')
      .replaceAll(/\s+/g, ' ')
      .trim(),
  };
}

function stylePropertyFrom(declaration: Declaration): ApiStyleProperty | null {
  const documentation: string | null = precedingDocumentation(declaration);
  if (!documentation) return null;

  if (declaration.prop.startsWith(STYLE_PROPERTY_PREFIX)) {
    return parseStyleProperty(declaration.prop, declaration.value, documentation);
  }

  const reference: RegExpExecArray | null = STYLE_REFERENCE_PATTERN.exec(declaration.value);
  return reference ? parseStyleProperty(reference[1], 'theme default', documentation) : null;
}

function readStyleProperties(files: readonly string[]): readonly ApiStyleProperty[] {
  const properties: Map<string, ApiStyleProperty> = new Map<string, ApiStyleProperty>();
  for (const file of files) {
    const stylesheet: Root = postcss.parse(readFileSync(file, 'utf8'), { from: file });
    stylesheet.walkDecls((declaration: Declaration): void => {
      const property: ApiStyleProperty | null = stylePropertyFrom(declaration);
      if (property && !properties.has(property.name)) properties.set(property.name, property);
    });
  }

  return [...properties.values()];
}

// Angular metadata and class declarations

export function readClassDeclaration(node: ts.ClassDeclaration): string {
  const className: string = node.name?.text ?? '';
  const parameters: string =
    node.typeParameters?.map((parameter: ts.TypeParameterDeclaration): string => parameter.getText()).join(', ') ?? '';

  return parameters ? `${className}<${parameters}>` : className;
}

function readTypeParameterDefinitions(node: TypeParameterOwner): readonly ApiTypeParameter[] {
  return (node.typeParameters ?? []).map((parameter: ts.TypeParameterDeclaration): ApiTypeParameter => ({
    name: parameter.name.text,
    constraint: parameter.constraint?.getText() ?? null,
    defaultValue: parameter.default?.getText() ?? null,
  }));
}

function findAngularMetadata(node: ts.ClassDeclaration): ts.ObjectLiteralExpression | null {
  const decorators: readonly ts.Decorator[] = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
  const decorator: ts.Decorator | undefined = decorators.find((item: ts.Decorator): boolean => {
    if (!ts.isCallExpression(item.expression)) return false;
    const name: string = item.expression.expression.getText();
    return ANGULAR_DECLARATION_DECORATORS.has(name);
  });

  if (!decorator || !ts.isCallExpression(decorator.expression)) return null;

  const metadata: ts.Expression | undefined = decorator.expression.arguments.at(0);
  return metadata && ts.isObjectLiteralExpression(metadata) ? metadata : null;
}

function findMetadataProperty(metadata: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  return metadata.properties.find(
    (item: ts.ObjectLiteralElementLike): item is ts.PropertyAssignment =>
      ts.isPropertyAssignment(item) && item.name.getText() === name,
  );
}

export function findSelector(node: ts.ClassDeclaration): string | null {
  const metadata: ts.ObjectLiteralExpression | null = findAngularMetadata(node);
  const property: ts.PropertyAssignment | undefined = metadata
    ? findMetadataProperty(metadata, SELECTOR_METADATA_PROPERTY)
    : undefined;
  return property && ts.isStringLiteralLike(property.initializer) ? property.initializer.text : null;
}

export function isInjectable(node: ts.ClassDeclaration): boolean {
  const decorators: readonly ts.Decorator[] = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
  return decorators.some(
    (decorator: ts.Decorator): boolean =>
      ts.isCallExpression(decorator.expression) && decorator.expression.expression.getText() === INJECTABLE_DECORATOR,
  );
}

function findStyleFile(node: ts.ClassDeclaration): string | null {
  const metadata: ts.ObjectLiteralExpression | null = findAngularMetadata(node);
  const property: ts.PropertyAssignment | undefined = metadata
    ? findMetadataProperty(metadata, STYLE_URL_METADATA_PROPERTY)
    : undefined;
  if (!property || !ts.isStringLiteralLike(property.initializer)) return null;

  const file: string = resolve(dirname(node.getSourceFile().fileName), property.initializer.text);
  return existsSync(file) ? file : null;
}

export function readComponentStyles(
  node: ts.ClassDeclaration,
  route: string,
  globalStylesByRoute: ReadonlyMap<string, readonly string[]>,
): ApiReferenceData['styles'] {
  const componentStyle: string | null = findStyleFile(node);
  return readStyleProperties([...(componentStyle ? [componentStyle] : []), ...(globalStylesByRoute.get(route) ?? [])]);
}

export function readJSDoc(node: ts.Node): string {
  const description: string = ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((comment: ts.JSDoc): string => ts.getTextOfJSDocComment(comment.comment) ?? '')
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('`', '')
    .trim();
  if (description || !ts.isClassDeclaration(node)) return description;

  // Some existing declarations place JSDoc between the Angular decorator and `export`.
  const exportModifier: ts.ModifierLike | undefined = node.modifiers?.find(
    (modifier: ts.ModifierLike): boolean => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
  if (!exportModifier) return '';

  const source: string = node.getSourceFile().text;
  const ranges: readonly ts.CommentRange[] = ts.getLeadingCommentRanges(source, exportModifier.getFullStart()) ?? [];
  const range: ts.CommentRange | undefined = [...ranges]
    .reverse()
    .find((candidate: ts.CommentRange): boolean => source.slice(candidate.pos, candidate.end).startsWith(JSDOC_OPENING));
  if (!range) return '';

  return source
    .slice(range.pos + JSDOC_OPENING.length, range.end - 2)
    .replaceAll(/^\s*\* ?/gmu, '')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('`', '')
    .trim();
}

export function isInternal(node: ts.Node): boolean {
  return ts.getJSDocTags(node).some((tag: ts.JSDocTag): boolean => tag.tagName.text === INTERNAL_JSDOC_TAG);
}

// Public inputs, models, outputs and methods

function isPublic(node: ts.Node & { readonly modifiers?: ts.NodeArray<ts.ModifierLike> }): boolean {
  return !node.modifiers?.some(
    (modifier: ts.ModifierLike): boolean =>
      modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
  );
}

function symbolName(expression: ts.Expression, checker: ts.TypeChecker): string {
  if (ts.isPropertyAccessExpression(expression)) {
    return `${symbolName(expression.expression, checker)}.${expression.name.text}`;
  }
  const symbol: ts.Symbol | undefined = checker.getSymbolAtLocation(expression);
  const target: ts.Symbol | undefined = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  return target?.getName() ?? expression.getText();
}

function readSignalKind(initializer: ts.Expression | undefined, checker: ts.TypeChecker): ApiMemberKind | null {
  if (!initializer || !ts.isCallExpression(initializer)) return null;

  const name: string = symbolName(initializer.expression, checker);
  return SIGNAL_KINDS.get(name) ?? null;
}

function readSignalType(property: ts.PropertyDeclaration, checker: ts.TypeChecker): string {
  if (property.type && ts.isTypeReferenceNode(property.type) && property.type.typeArguments?.[0]) {
    return property.type.typeArguments[0].getText();
  }

  return checker.typeToString(checker.getTypeAtLocation(property));
}

function readDefaultValue(property: ts.PropertyDeclaration, kind: ApiMemberKind): string | null {
  const initializer: ts.Expression | undefined = property.initializer;
  if (!initializer || !ts.isCallExpression(initializer) || kind === 'output') return null;

  if (ts.isPropertyAccessExpression(initializer.expression) && initializer.expression.name.text === 'required') {
    return 'required';
  }

  return initializer.arguments.at(0)?.getText() ?? 'undefined';
}

function readMethodType(method: ts.MethodDeclaration): string {
  const parameters: string = method.parameters
    .map((parameter: ts.ParameterDeclaration): string => parameter.getText())
    .join(', ');

  return `(${parameters}) => ${method.type?.getText() ?? 'void'}`;
}

function readPropertyMember(member: ts.PropertyDeclaration, checker: ts.TypeChecker): ApiMember | null {
  const kind: ApiMemberKind | null = readSignalKind(member.initializer, checker);
  if (!kind) return null;

  return {
    name: member.name.getText(),
    kind,
    type: readSignalType(member, checker),
    defaultValue: readDefaultValue(member, kind),
    description: readJSDoc(member),
  };
}

function readMethodMember(member: ts.MethodDeclaration): ApiMember | null {
  const modifiers: readonly ts.Modifier[] = ts.canHaveModifiers(member) ? (ts.getModifiers(member) ?? []) : [];
  const isStatic: boolean = modifiers.some((modifier: ts.Modifier): boolean => modifier.kind === ts.SyntaxKind.StaticKeyword);
  if (isStatic) return null;

  return {
    name: member.name.getText(),
    kind: 'method',
    type: readMethodType(member),
    defaultValue: null,
    description: readJSDoc(member),
  };
}

function readMember(member: ts.ClassElement, checker: ts.TypeChecker): ApiMember | null {
  if (!member.name || !isPublic(member) || isInternal(member)) return null;

  if (ts.isPropertyDeclaration(member)) return readPropertyMember(member, checker);
  if (ts.isMethodDeclaration(member)) return readMethodMember(member);

  return null;
}

function readDeclaredMembers(node: ts.ClassDeclaration, checker: ts.TypeChecker): ApiMember[] {
  const members: ApiMember[] = [];
  for (const classMember of node.members) {
    const member: ApiMember | null = readMember(classMember, checker);
    if (member) members.push(member);
  }

  return members;
}

function findBaseClass(node: ts.ClassDeclaration, checker: ts.TypeChecker): ts.ClassDeclaration | null {
  const clause: ts.HeritageClause | undefined = node.heritageClauses?.find(
    (item: ts.HeritageClause): boolean => item.token === ts.SyntaxKind.ExtendsKeyword,
  );
  const heritage: ts.ExpressionWithTypeArguments | undefined = clause?.types[0];
  if (!heritage) return null;

  const symbol: ts.Symbol | undefined = checker.getSymbolAtLocation(heritage.expression);
  const target: ts.Symbol | undefined = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  return target?.declarations?.find(ts.isClassDeclaration) ?? null;
}

export function readMembers(node: ts.ClassDeclaration, checker: ts.TypeChecker): ApiMember[] {
  const members: Map<string, ApiMember> = new Map<string, ApiMember>();
  let current: ts.ClassDeclaration | null = node;
  while (current) {
    for (const member of readDeclaredMembers(current, checker)) {
      if (!members.has(member.name)) members.set(member.name, member);
    }
    current = findBaseClass(current, checker);
  }

  return [...members.values()];
}

export function readTemplateContext(node: ts.ClassDeclaration): string {
  const guard: ts.ClassElement | undefined = node.members.find(
    (member: ts.ClassElement): boolean => ts.isMethodDeclaration(member) && member.name.getText() === TEMPLATE_CONTEXT_GUARD,
  );
  if (guard && ts.isMethodDeclaration(guard) && guard.type && ts.isTypePredicateNode(guard.type)) {
    return guard.type.type?.getText() ?? 'void';
  }

  const context: ts.ClassElement | undefined = node.members.find(
    (member: ts.ClassElement): boolean => ts.isPropertyDeclaration(member) && member.name.getText() === TEMPLATE_CONTEXT_PROPERTY,
  );
  return context && ts.isPropertyDeclaration(context) ? (context.type?.getText() ?? 'void') : 'void';
}

// Exported interfaces, aliases and enums

function isExported(node: ts.Node): boolean {
  return Boolean(
    ts.canHaveModifiers(node) &&
    ts.getModifiers(node)?.some((modifier: ts.Modifier): boolean => modifier.kind === ts.SyntaxKind.ExportKeyword),
  );
}

function isApiTypeNode(node: ts.Statement): node is ApiTypeNode {
  return ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node);
}

function readTypeParameters(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): string {
  const parameters: string = node.typeParameters?.map((item): string => item.getText()).join(', ') ?? '';

  return parameters ? `<${parameters}>` : '';
}

function readEnumDeclaration(node: ts.EnumDeclaration): string {
  const members: string = node.members.map((member): string => `  ${member.getText()},`).join('\n');

  return `enum ${node.name.text} {\n${members}\n}`;
}

function readAliasDeclaration(node: ts.TypeAliasDeclaration): string {
  return `type ${node.name.text}${readTypeParameters(node)} = ${node.type.getText()};`;
}

function readInterfaceDeclaration(node: ts.InterfaceDeclaration): string {
  const heritage: string = node.heritageClauses?.map((clause): string => clause.getText()).join(' ') ?? '';
  const members: string = node.members.map((member): string => `  ${member.getText()}`).join('\n');

  return `interface ${node.name.text}${readTypeParameters(node)}${heritage ? ` ${heritage}` : ''} {\n${members}\n}`;
}

function readTypeDeclaration(node: ApiTypeNode): string {
  if (ts.isEnumDeclaration(node)) return readEnumDeclaration(node);
  if (ts.isTypeAliasDeclaration(node)) return readAliasDeclaration(node);
  return readInterfaceDeclaration(node);
}

function readTypeMembers(node: ApiTypeNode): readonly ApiTypeMember[] {
  if (!ts.isInterfaceDeclaration(node)) return [];
  const members: ApiTypeMember[] = [];
  for (const member of node.members) {
    if (!ts.isPropertySignature(member) || !member.type) continue;
    members.push({
      name: member.name.getText(),
      type: member.type.getText(),
      optional: Boolean(member.questionToken),
      description: readJSDoc(member),
    });
  }

  return members;
}

function readTypeKind(node: ApiTypeNode): ApiTypeKind {
  if (ts.isInterfaceDeclaration(node)) return 'interface';
  if (ts.isTypeAliasDeclaration(node)) return 'type';

  return 'enum';
}

function readTypeDefinition(statement: ts.Statement, requireExport: boolean): ApiTypeDefinition | null {
  if (!isApiTypeNode(statement) || (requireExport && !isExported(statement)) || isInternal(statement)) return null;

  return {
    name: statement.name.text,
    kind: readTypeKind(statement),
    source: 'library',
    declaration: readTypeDeclaration(statement),
    description: readJSDoc(statement),
    members: readTypeMembers(statement),
    typeParameters: ts.isEnumDeclaration(statement) ? [] : readTypeParameterDefinitions(statement),
  };
}

function addTypeSymbols(type: ts.Type, checker: ts.TypeChecker, names: Set<string>, visited: Set<ts.Type>): void {
  const symbol: ts.Symbol | undefined = type.aliasSymbol ?? type.getSymbol();
  if (symbol) names.add(checker.symbolToString(symbol));

  if (visited.has(type)) return;
  visited.add(type);

  if (type.isUnionOrIntersection()) {
    for (const part of type.types) addTypeSymbols(part, checker, names, visited);
  }
  if (type.aliasTypeArguments) {
    for (const argument of type.aliasTypeArguments) addTypeSymbols(argument, checker, names, visited);
  }
  if (type.flags & ts.TypeFlags.Object && (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Reference) {
    for (const argument of checker.getTypeArguments(type as ts.TypeReference)) {
      addTypeSymbols(argument, checker, names, visited);
    }
  }
}

function findReferencedTypeNames(node: ts.Node, checker: ts.TypeChecker): readonly string[] {
  const names: Set<string> = new Set<string>();
  const visited: Set<ts.Type> = new Set<ts.Type>();
  const visit: (child: ts.Node) => void = (child: ts.Node): void => {
    if (ts.isTypeReferenceNode(child)) {
      const referencedSymbol: ts.Symbol | undefined = checker.getSymbolAtLocation(child.typeName);
      const symbol: ts.Symbol | undefined =
        referencedSymbol && referencedSymbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(referencedSymbol)
          : referencedSymbol;
      if (symbol) names.add(symbol.getName());
    }

    if (ts.isTypeNode(child)) {
      addTypeSymbols(checker.getTypeFromTypeNode(child), checker, names, visited);
    }

    ts.forEachChild(child, visit);
  };

  visit(node);

  return [...names];
}

function addReferencedNames(node: ts.Node, checker: ts.TypeChecker, names: Set<string>): void {
  for (const name of findReferencedTypeNames(node, checker)) names.add(name);
}

function isApiClassMember(member: ts.ClassElement, checker: ts.TypeChecker): boolean {
  if (!member.name || !isPublic(member) || isInternal(member)) return false;
  if (ts.isMethodDeclaration(member)) return true;

  return ts.isPropertyDeclaration(member) && readSignalKind(member.initializer, checker) !== null;
}

function addClassTypeNames(node: ts.ClassDeclaration, checker: ts.TypeChecker, names: Set<string>): void {
  for (const parameter of node.typeParameters ?? []) addReferencedNames(parameter, checker, names);
  for (const clause of node.heritageClauses ?? []) addReferencedNames(clause, checker, names);
  for (const member of node.members) {
    if (isApiClassMember(member, checker)) addReferencedNames(member, checker, names);
  }
}

function publicMemberTypeNames(node: ts.ClassDeclaration, checker: ts.TypeChecker): readonly string[] {
  const names: Set<string> = new Set<string>();
  let current: ts.ClassDeclaration | null = node;
  while (current) {
    addClassTypeNames(current, checker, names);
    current = findBaseClass(current, checker);
  }

  return [...names];
}

/** Reads public Angular declarations and the TypeScript models referenced by their API. */
export class ApiSourceReader {
  public constructor(private readonly checker: ts.TypeChecker) {}

  public readClass(node: ts.ClassDeclaration): ApiClassDeclaration {
    return {
      declaration: readClassDeclaration(node),
      description: readJSDoc(node),
      members: readMembers(node, this.checker),
      referencedTypes: publicMemberTypeNames(node, this.checker),
      selector: findSelector(node),
      typeParameters: readTypeParameterDefinitions(node),
    };
  }

  public readTemplate(node: ts.ClassDeclaration, selector: string): ApiTemplateDeclaration {
    return {
      template: {
        name: selector.slice(TEMPLATE_SELECTOR_PREFIX.length, -1),
        context: readTemplateContext(node),
        description: readJSDoc(node),
        members: readMembers(node, this.checker),
      },
      referencedTypes: findReferencedTypeNames(node, this.checker),
    };
  }

  public readType(statement: ts.Statement, requireExport: boolean = true): ApiTypeDeclaration | null {
    const definition: ApiTypeDefinition | null = readTypeDefinition(statement, requireExport);

    return definition ? { definition, referencedTypes: findReferencedTypeNames(statement, this.checker) } : null;
  }

  public findReferencedTypes(
    initialNames: readonly string[],
    definitions: ReadonlyMap<string, ApiTypeDefinition>,
    dependencies: ReadonlyMap<string, readonly string[]>,
  ): readonly ApiTypeDefinition[] {
    const pending: string[] = [...initialNames];
    const found: Map<string, ApiTypeDefinition> = new Map<string, ApiTypeDefinition>();
    while (pending.length) {
      const name: string | undefined = pending.shift();
      const definition: ApiTypeDefinition | undefined = name ? definitions.get(name) : undefined;
      if (!definition || found.has(definition.name)) continue;

      found.set(definition.name, definition);
      pending.push(...(dependencies.get(definition.name) ?? []));
    }

    return [...found.values()].sort((first, second): number => first.name.localeCompare(second.name));
  }
}
