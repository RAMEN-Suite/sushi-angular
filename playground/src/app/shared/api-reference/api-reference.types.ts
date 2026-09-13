export type ApiMemberKind = 'input' | 'model' | 'output' | 'method';

export interface ApiMember {
  readonly name: string;
  readonly kind: ApiMemberKind;
  readonly type: string;
  readonly defaultValue: string | null;
  readonly description: string;
}

export interface ApiTemplate {
  readonly name: string;
  readonly context: string;
  readonly description: string;
  readonly members: readonly ApiMember[];
}

export interface ApiTypeMember {
  readonly name: string;
  readonly type: string;
  readonly optional: boolean;
  readonly description: string;
}

export interface ApiTypeParameter {
  readonly name: string;
  readonly constraint: string | null;
  readonly defaultValue: string | null;
}

export type ApiTypeKind = 'interface' | 'type' | 'enum';

export interface ApiTypeDefinition {
  readonly name: string;
  readonly kind: ApiTypeKind;
  readonly source: 'library' | 'platform';
  readonly declaration: string;
  readonly description: string;
  readonly members: readonly ApiTypeMember[];
  readonly typeParameters: readonly ApiTypeParameter[];
}

export interface ApiStyleProperty {
  readonly name: string;
  readonly defaultValue: string;
  readonly exampleValue: string | null;
  readonly description: string;
}

export interface ApiReferenceData {
  readonly className: string;
  readonly declaration: string;
  readonly selector: string;
  readonly description: string;
  readonly members: readonly ApiMember[];
  readonly templates: readonly ApiTemplate[];
  readonly typeParameters: readonly ApiTypeParameter[];
  readonly types: readonly ApiTypeDefinition[];
  readonly styles: readonly ApiStyleProperty[];
}
