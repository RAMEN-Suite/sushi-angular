import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChefHat } from '@lucide/angular';
import { Button, Popover, PopoverTrigger } from '@ramen-suite/sushi';

interface Member {
  readonly name: string;
  readonly email: string;
}

@Component({
  selector: 'pg-popover-selection-example',
  imports: [Button, LucideChefHat, Popover, PopoverTrigger],
  templateUrl: './selection.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverSelectionExample {
  protected readonly selected: WritableSignal<Member | null> = signal<Member | null>(null);
  protected readonly members: readonly Member[] = [
    { name: 'Aiko Tanaka', email: 'aiko@example.com' },
    { name: 'Mina Park', email: 'mina@example.com' },
    { name: 'Noah Kim', email: 'noah@example.com' },
  ];
  protected select(member: Member, popover: Popover): void {
    this.selected.set(member);
    popover.hide(true);
  }
}
