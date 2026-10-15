import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, type WritableSignal } from '@angular/core';
import { Badge, Label, Listbox, ListboxFooterTemplate, ListboxHeaderTemplate, type ListboxOption } from '@sushi-kit/angular';

@Component({
  selector: 'pg-listbox-lazy-example',
  imports: [Badge, Label, Listbox, ListboxFooterTemplate, ListboxHeaderTemplate],
  templateUrl: './lazy.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxLazyExample {
  private readonly pageSize: number = 6;
  private readonly members: readonly ListboxOption[] = Array.from(
    { length: 24 },
    (_value: unknown, index: number): ListboxOption => ({
      label: `Team member ${index + 1}`,
      value: index + 1,
    }),
  );

  protected readonly options: WritableSignal<readonly ListboxOption[]> = signal(this.members.slice(0, 12));
  protected readonly loading: WritableSignal<boolean> = signal(false);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | undefined;

  public constructor() {
    this.destroyRef.onDestroy((): void => clearTimeout(this.timer));
  }

  protected loadMore(offset: number): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.timer = setTimeout((): void => {
      this.options.set(this.members.slice(0, offset + this.pageSize));
      this.loading.set(false);
    }, 500);
  }
}
