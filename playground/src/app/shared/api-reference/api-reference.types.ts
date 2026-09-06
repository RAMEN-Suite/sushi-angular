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

export type ApiTypeKind = 'interface' | 'type' | 'enum';

export interface ApiTypeDefinition {
  readonly name: string;
  readonly kind: ApiTypeKind;
  readonly declaration: string;
  readonly description: string;
}

export interface ApiStyleProperty {
  readonly name: string;
  readonly defaultValue: string;
  readonly exampleValue: string | null;
  readonly description: string;
}

export interface ApiReferenceData {
  readonly className: string;
  readonly selector: string;
  readonly description: string;
  readonly members: readonly ApiMember[];
  readonly templates: readonly ApiTemplate[];
  readonly types: readonly ApiTypeDefinition[];
  readonly styles: readonly ApiStyleProperty[];
}
