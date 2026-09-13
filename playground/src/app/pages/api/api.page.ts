import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { Button, Card } from '@ramen-suite/sushi';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import { apiFragmentHref, navigateToApiTarget } from '../../shared/api-reference/api-reference-navigation';
import { apiReferences } from '../../generated/api-reference.generated';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';

@Component({
  selector: 'pg-api-page',
  imports: [ApiReference, Button, Card],
  templateUrl: './api.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiPage {
  public readonly component: InputSignal<string> = input.required<string>();
  public readonly name: InputSignal<string> = input.required<string>();

  protected readonly api: Signal<readonly ApiReferenceData[] | undefined> = computed(() => apiReferences[this.component()]);
  private readonly document: Document = inject(DOCUMENT);

  protected referenceId(reference: ApiReferenceData): string {
    return `api-reference-${reference.className}`;
  }

  protected fragmentHref(reference: ApiReferenceData): string {
    return apiFragmentHref(this.document, this.referenceId(reference));
  }

  protected navigateToReference(event: MouseEvent, reference: ApiReferenceData): void {
    navigateToApiTarget(this.document, event, this.referenceId(reference));
  }
}
