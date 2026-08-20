import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@ramen-suite/sushi';
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

@Component({
  selector: 'pg-api-reference',
  imports: [Badge, RouterLink],
  templateUrl: './api-reference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiReference {
  public readonly api: InputSignal<ApiReferenceData> = input.required<ApiReferenceData>();

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
