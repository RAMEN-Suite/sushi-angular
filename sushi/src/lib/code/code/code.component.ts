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
import { SuiToggleButton, SuiToggleButtonOffTemplate, SuiToggleButtonOnTemplate } from '../../toggle-button';
import { SuiBooleanInput, SuiBooleanInputValue, SuiTemplate } from '../../sushi.types';
import { SuiCodeButtonContext } from '../code.interfaces';
import { SuiCodeLine } from '../code-line.directive';
import { SuiCodeCopiedIcon, SuiCodeCopyButton, SuiCodeCopyIcon } from '../code.templates';

@Component({
  selector: 'sui-code',
  standalone: true,
  imports: [NgTemplateOutlet, LucideCheck, LucideCopy, SuiToggleButton, SuiToggleButtonOffTemplate, SuiToggleButtonOnTemplate],
  templateUrl: './code.component.html',
  styleUrl: './code.component.css',
  host: {
    class: 'mockup-code sui-code-control relative block',
  },
})
export class SuiCode {
  public readonly copyable: SuiBooleanInput = input<boolean, SuiBooleanInputValue>(true, { transform: booleanAttribute });
  public readonly cooldown: InputSignal<number> = input<number>(1200);

  public constructor() {
    this.destroyRef.onDestroy((): void => {
      if (this.resetTimer) clearTimeout(this.resetTimer);
    });
  }

  protected readonly lines: Signal<readonly SuiCodeLine[]> = contentChildren(SuiCodeLine, { descendants: true });
  protected readonly copyButtonRef: SuiTemplate<SuiCodeButtonContext> = contentChild(SuiCodeCopyButton, { read: TemplateRef });
  protected readonly copyIconRef: SuiTemplate<void> = contentChild(SuiCodeCopyIcon, { read: TemplateRef });
  protected readonly copiedIconRef: SuiTemplate<void> = contentChild(SuiCodeCopiedIcon, { read: TemplateRef });

  protected readonly isCopied: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly buttonContext: SuiCodeButtonContext = {
    $implicit: (): void => this.copyCodeLines(),
    copy: (): void => this.copyCodeLines(),
    copied: this.isCopied,
  };

  protected handleCheckedChange(checked: boolean): void {
    if (!checked) return;
    this.copyCodeLines();
  }

  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

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
    const lines: string[] = this.lines().map((line: SuiCodeLine): string => line.text());
    return lines.join('\n').trimEnd();
  }
}
