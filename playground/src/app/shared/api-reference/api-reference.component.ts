import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import type { ApiMember, ApiMemberKind, ApiReferenceData } from './api-reference.types';

interface ApiGroup {
  readonly kind: ApiMemberKind;
  readonly label: string;
  readonly members: readonly ApiMember[];
}

const labels: Readonly<Record<ApiMemberKind, string>> = {
  input: 'Inputs',
  model: 'Models',
  output: 'Outputs',
  method: 'Methods',
};

@Component({
  selector: 'pg-api-reference',
  imports: [Badge],
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
}
