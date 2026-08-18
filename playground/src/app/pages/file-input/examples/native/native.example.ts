import { ChangeDetectionStrategy, Component, ElementRef, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { Button, Fieldset, FieldsetLegend, FileInput, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-file-input-native-example',
  imports: [Button, Fieldset, FieldsetLegend, FileInput, Label],
  templateUrl: './native.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputNativeExample {
  protected readonly selected: WritableSignal<readonly string[]> = signal([]);
  private readonly input: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild<ElementRef<HTMLInputElement>>('input');

  protected handleFiles(event: Event): void {
    const target: EventTarget | null = event.target;
    this.selected.set(
      target instanceof HTMLInputElement ? Array.from(target.files ?? [], (file: File): string => file.name) : [],
    );
  }

  protected reset(): void {
    const input: HTMLInputElement | undefined = this.input()?.nativeElement;
    if (input) input.value = '';
    this.selected.set([]);
  }
}
