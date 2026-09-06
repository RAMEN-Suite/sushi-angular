import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, List, ListItemTemplate, Table, TableCellTemplate, TableColumn } from '@ramen-suite/sushi';
import type { ApiMember, ApiMemberKind, ApiReferenceData, ApiTemplate, ApiTypeDefinition } from './api-reference.types';

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

@Component({
  selector: 'pg-api-reference',
  imports: [Badge, List, ListItemTemplate, RouterLink, Table, TableCellTemplate],
  templateUrl: './api-reference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiReference {
  public readonly api: InputSignal<ApiReferenceData> = input.required<ApiReferenceData>();

  protected readonly memberColumns: readonly TableColumn<ApiMember>[] = memberColumns;
  protected readonly templateColumns: readonly TableColumn<ApiTemplate>[] = templateColumns;

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
    const names: ReadonlySet<string> = new Set<string>(api.types.map((type: ApiTypeDefinition): string => type.name));
    const values: readonly string[] = [
      ...api.members.map((member: ApiMember): string => member.type),
      ...api.templates.map((template: ApiTemplate): string => template.context),
      ...api.templates.flatMap((template: ApiTemplate): readonly string[] =>
        template.members.map((member: ApiMember): string => member.type),
      ),
    ];

    return new Map<string, readonly ApiTypePart[]>(
      values.map((value: string): [string, readonly ApiTypePart[]] => [value, this.splitType(value, names)]),
    );
  });

  protected typeId(name: string): string {
    return `api-${this.api().className}-type-${name}`;
  }

  private splitType(value: string, names: ReadonlySet<string>): readonly ApiTypePart[] {
    return value.split(/(\b[A-Za-z_$][\w$]*\b)/u).map((text: string): ApiTypePart => ({
      text,
      reference: names.has(text) ? text : null,
    }));
  }
}
