import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { Badge, List, ListItemTemplate, Table, TableCellTemplate, TableColumn } from '@ramen-suite/sushi';
import type {
  ApiMember,
  ApiMemberKind,
  ApiReferenceData,
  ApiTemplate,
  ApiTypeDefinition,
  ApiTypeMember,
  ApiTypeParameter,
} from './api-reference.types';
import { apiFragmentHref, navigateToApiTarget } from './api-reference-navigation';

interface ApiGroup {
  readonly kind: ApiMemberKind;
  readonly label: string;
  readonly members: readonly ApiMember[];
}

interface ApiTypePart {
  readonly text: string;
  readonly reference: string | null;
}

const labels: Readonly<Record<ApiMemberKind, string>> = {
  input: 'Inputs',
  model: 'Models',
  output: 'Outputs',
  method: 'Methods',
};

const memberColumns: readonly TableColumn<ApiMember>[] = [
  { key: 'name', header: 'Name', value: (member: ApiMember): string => member.name, minWidth: '10rem' },
  { key: 'type', header: 'Type', value: (member: ApiMember): string => member.type, minWidth: '12rem' },
  { key: 'default', header: 'Default', value: (member: ApiMember): string => member.defaultValue ?? '—', minWidth: '8rem' },
  {
    key: 'description',
    header: 'Description',
    value: (member: ApiMember): string => member.description || '—',
    minWidth: '16rem',
  },
];

const templateColumns: readonly TableColumn<ApiTemplate>[] = [
  { key: 'marker', header: 'Marker', value: (template: ApiTemplate): string => template.name, minWidth: '10rem' },
  { key: 'context', header: 'Context', value: (template: ApiTemplate): string => template.context, minWidth: '12rem' },
  {
    key: 'inputs',
    header: 'Inputs',
    value: (template: ApiTemplate): readonly ApiMember[] => template.members,
    minWidth: '16rem',
  },
  {
    key: 'description',
    header: 'Description',
    value: (template: ApiTemplate): string => template.description || '—',
    minWidth: '16rem',
  },
];

const typeMemberColumns: readonly TableColumn<ApiTypeMember>[] = [
  { key: 'name', header: 'Field', value: (member: ApiTypeMember): string => member.name, minWidth: '10rem' },
  { key: 'type', header: 'Type', value: (member: ApiTypeMember): string => member.type, minWidth: '12rem' },
  {
    key: 'description',
    header: 'Description',
    value: (member: ApiTypeMember): string => member.description,
    minWidth: '18rem',
  },
];

const typeColumns: readonly TableColumn<ApiTypeDefinition>[] = [
  { key: 'name', header: 'Name', value: (type: ApiTypeDefinition): string => type.name, minWidth: '14rem' },
  { key: 'kind', header: 'Kind', value: (type: ApiTypeDefinition): string => type.kind, minWidth: '7rem' },
  {
    key: 'definition',
    header: 'Definition',
    value: (type: ApiTypeDefinition): string => type.declaration,
    minWidth: '14rem',
  },
  {
    key: 'description',
    header: 'Description',
    value: (type: ApiTypeDefinition): string => type.description || '—',
    minWidth: '20rem',
  },
];

const typeParameterColumns: readonly TableColumn<ApiTypeParameter>[] = [
  { key: 'name', header: 'Parameter', value: (parameter: ApiTypeParameter): string => parameter.name, minWidth: '10rem' },
  {
    key: 'constraint',
    header: 'Constraint',
    value: (parameter: ApiTypeParameter): string => parameter.constraint ?? '—',
    minWidth: '12rem',
  },
  {
    key: 'default',
    header: 'Default',
    value: (parameter: ApiTypeParameter): string => parameter.defaultValue ?? '—',
    minWidth: '12rem',
  },
];

@Component({
  selector: 'pg-api-reference',
  imports: [Badge, List, ListItemTemplate, NgTemplateOutlet, Table, TableCellTemplate],
  templateUrl: './api-reference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiReference {
  public readonly api: InputSignal<ApiReferenceData> = input.required<ApiReferenceData>();

  // Table definitions stay outside the template so every section follows the same structure.
  protected readonly memberColumns: readonly TableColumn<ApiMember>[] = memberColumns;
  protected readonly templateColumns: readonly TableColumn<ApiTemplate>[] = templateColumns;
  protected readonly typeMemberColumns: readonly TableColumn<ApiTypeMember>[] = typeMemberColumns;
  protected readonly typeColumns: readonly TableColumn<ApiTypeDefinition>[] = typeColumns;
  protected readonly typeParameterColumns: readonly TableColumn<ApiTypeParameter>[] = typeParameterColumns;

  // Data prepared for the view.
  protected readonly groups: Signal<readonly ApiGroup[]> = computed(() =>
    (Object.keys(labels) as ApiMemberKind[])
      .map((kind: ApiMemberKind): ApiGroup => ({
        kind,
        label: labels[kind],
        members: this.api().members.filter((member: ApiMember): boolean => member.kind === kind),
      }))
      .filter((group: ApiGroup): boolean => group.members.length > 0),
  );

  protected readonly typeParts: Signal<ReadonlyMap<string, readonly ApiTypePart[]>> = computed(() => {
    const api: ApiReferenceData = this.api();
    const names: ReadonlySet<string> = this.typeNames(api);

    return new Map<string, readonly ApiTypePart[]>(
      this.typeValues(api).map((value: string): [string, readonly ApiTypePart[]] => [value, this.splitType(value, names)]),
    );
  });

  private readonly document: Document = inject(DOCUMENT);

  // Stable targets used by type links and browser fragments.
  protected typeId(name: string): string {
    return `api-${this.api().className}-type-${name}`;
  }

  protected sectionId(name: string): string {
    return `api-${this.api().className}-${name}`;
  }

  protected typeParameterId(name: string): string {
    return `api-${this.api().className}-type-parameter-${name}`;
  }

  protected typeReferenceId(name: string): string {
    return this.api().typeParameters.some((parameter: ApiTypeParameter): boolean => parameter.name === name)
      ? this.typeParameterId(name)
      : this.typeId(name);
  }

  protected typeDefinitionParameterId(type: ApiTypeDefinition, name: string): string {
    return `${this.typeId(type.name)}-parameter-${name}`;
  }

  protected typePartReferenceId(name: string, type: ApiTypeDefinition): string {
    return type.typeParameters.some((parameter: ApiTypeParameter): boolean => parameter.name === name)
      ? this.typeDefinitionParameterId(type, name)
      : this.typeReferenceId(name);
  }

  protected isOwnTypeParameter(name: string, type: ApiTypeDefinition): boolean {
    return type.typeParameters.some((parameter: ApiTypeParameter): boolean => parameter.name === name);
  }

  protected typeSeverity(kind: ApiTypeDefinition['kind']): 'accent' | 'info' | 'secondary' {
    if (kind === 'interface') return 'info';
    if (kind === 'enum') return 'accent';
    return 'secondary';
  }

  protected showsTypeDetails(type: ApiTypeDefinition): boolean {
    return type.source === 'library' && type.members.length > 0;
  }

  protected typeSignature(type: ApiTypeDefinition): string {
    if (type.kind !== 'interface') return type.name;

    const bodyStart: number = type.declaration.indexOf('{');

    return bodyStart < 0 ? type.declaration : type.declaration.slice(0, bodyStart).trim();
  }

  protected typeDefinition(type: ApiTypeDefinition): string {
    if (type.source === 'platform') return 'Browser API';
    if (type.kind === 'interface') return 'Fields below';
    if (type.kind === 'type') {
      const assignment: number = type.declaration.indexOf('=');

      return type.declaration
        .slice(assignment + 1)
        .replace(/;$/u, '')
        .trim();
    }

    return type.declaration
      .replace(/^enum\s+\w+\s*\{/u, '')
      .replace(/\}$/u, '')
      .replaceAll(/,\s*/gu, ' · ')
      .trim();
  }

  protected fragmentHref(id: string): string {
    return apiFragmentHref(this.document, id);
  }

  protected navigateTo(event: MouseEvent, id: string): void {
    navigateToApiTarget(this.document, event, id);
  }

  protected hasExplicitDefault(member: ApiMember): boolean {
    return member.defaultValue !== null && member.defaultValue !== 'undefined';
  }

  // Split type expressions once so the template only decides how to display each part.
  private splitType(value: string, names: ReadonlySet<string>): readonly ApiTypePart[] {
    return value.split(/(\b[A-Za-z_$][\w$]*\b)/u).map((text: string): ApiTypePart => ({
      text,
      reference: names.has(text) ? text : null,
    }));
  }

  private typeNames(api: ApiReferenceData): ReadonlySet<string> {
    return new Set<string>([
      ...api.types.map((type: ApiTypeDefinition): string => type.name),
      ...api.typeParameters.map((parameter: ApiTypeParameter): string => parameter.name),
      ...api.types.flatMap((type: ApiTypeDefinition): readonly string[] =>
        type.typeParameters.map((parameter: ApiTypeParameter): string => parameter.name),
      ),
    ]);
  }

  private typeValues(api: ApiReferenceData): readonly string[] {
    return [
      api.declaration,
      ...api.members.map((member: ApiMember): string => member.type),
      ...api.templates.map((template: ApiTemplate): string => template.context),
      ...api.templates.flatMap((template: ApiTemplate): readonly string[] =>
        template.members.map((member: ApiMember): string => member.type),
      ),
      ...api.types.flatMap((type: ApiTypeDefinition): readonly string[] => [
        type.declaration,
        this.typeSignature(type),
        this.typeDefinition(type),
        ...type.members.map((member: ApiTypeMember): string => member.type),
      ]),
      ...api.typeParameters.flatMap((parameter: ApiTypeParameter): readonly string[] => [
        parameter.constraint ?? '',
        parameter.defaultValue ?? '',
      ]),
    ];
  }
}
