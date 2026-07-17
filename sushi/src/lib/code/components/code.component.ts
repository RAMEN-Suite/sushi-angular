import { Clipboard } from '@angular/cdk/clipboard';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  contentChild,
  contentChildren,
  DestroyRef,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import { ToggleButton, ToggleButtonAnimation, ToggleButtonOffTemplate, ToggleButtonOnTemplate, ToggleButtonShape } from '../../toggle-button';
import { BooleanInput, BooleanInputValue, Template } from '../../sushi.types';
import { CodeButtonContext } from '../code.interfaces';
import { CodeLine } from '../code-line.directive';
import { CodeButtonOffTemplate, CodeButtonOnTemplate, CodeButtonTemplate } from '../code.templates';

@Component({
  selector: 'sui-code',
  standalone: true,
  imports: [NgTemplateOutlet, LucideCheck, LucideCopy, ToggleButton, ToggleButtonOffTemplate, ToggleButtonOnTemplate],
  templateUrl: './code.component.html',
  styleUrl: './code.component.css',
  host: {
    class: 'mockup-code sui-code relative block',
  },
})
export class Code {
  public readonly copyable: BooleanInput = input<boolean, BooleanInputValue>(true, { transform: booleanAttribute });
  public readonly cooldown: InputSignal<number> = input<number>(1200);

  public readonly buttonAnimation: InputSignal<ToggleButtonAnimation | null> = input<ToggleButtonAnimation | null>('rotate');
  public readonly buttonShape: InputSignal<ToggleButtonShape | null> = input<ToggleButtonShape | null>('square');
  public readonly buttonAriaLabel: InputSignal<string | null> = input<string | null>(null);

  protected readonly codeLines: Signal<readonly CodeLine[]> = contentChildren(CodeLine, { descendants: true });
  protected readonly buttonOnRef: Template<void> = contentChild(CodeButtonOnTemplate, { read: TemplateRef });
  protected readonly buttonOffRef: Template<void> = contentChild(CodeButtonOffTemplate, { read: TemplateRef });
  protected readonly buttonRef: Template<CodeButtonContext> = contentChild(CodeButtonTemplate, { read: TemplateRef });

  protected readonly isCopied: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly buttonContext: CodeButtonContext = {
    $implicit: (): void => this.copyCodeLines(),
    copy: (): void => this.copyCodeLines(),
    copied: this.isCopied,
  };

  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  public constructor() {
    this.destroyRef.onDestroy((): void => {
      if (this.resetTimer) clearTimeout(this.resetTimer);
    });
  }

  protected handleCheckedChange(checked: boolean): void {
    if (!checked) return;
    this.copyCodeLines();
  }

  private copyCodeLines(): void {
    const text: string = this.getCodeLines();
    if (!text) {
      this.isCopied.set(false);
      return;
    }

    const isSuccessful: boolean = this.clipboard.copy(text);
    if (!isSuccessful) {
      this.isCopied.set(false);
      return;
    }

    this.isCopied.set(true);
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout((): void => this.isCopied.set(false), this.cooldown());
  }

  private getCodeLines(): string {
    const lines: string[] = this.codeLines().map((line: CodeLine): string => line.text());
    return lines.join('\n').trimEnd();
  }
}
