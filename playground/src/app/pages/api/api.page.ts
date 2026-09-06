import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Card } from '@ramen-suite/sushi';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import { apiReferences } from '../../shared/api-reference/api-reference.registry';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';

@Component({
  selector: 'pg-api-page',
  imports: [ApiReference, Card],
  templateUrl: './api.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiPage {
  public readonly component: InputSignal<string> = input.required<string>();
  public readonly name: InputSignal<string> = input.required<string>();

  protected readonly api: Signal<readonly ApiReferenceData[] | undefined> = computed(() => apiReferences[this.component()]);
}
