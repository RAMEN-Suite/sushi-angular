import {
  booleanAttribute,
  Component,
  contentChild,
  contentChildren,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgTemplateOutlet } from '@angular/common';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import { SuiButton } from '../button';
import { SuiBooleanInput, SuiBooleanInputValue, SuiTemplate } from '../sushi.types';
import { SuiCodeCopyButtonContext } from './code.interfaces';
import { SuiCodeCopiedIcon, SuiCodeCopyButton, SuiCodeCopyIcon } from './code-icon.directive';
import { SuiCodeLine } from './code-line.directive';

@Component({
  selector: 'sui-code',
  standalone: true,
  styleUrl: './code.component.css',
  templateUrl: './code.component.html',
  imports: [NgTemplateOutlet, LucideCopy, LucideCheck, SuiButton],
  host: {
    class: 'mockup-code sui-code-control relative block',
  },
})
export class SuiCode {
  private readonly clipboard: Clipboard = inject(Clipboard);

  protected readonly lines: Signal<readonly SuiCodeLine[]> = contentChildren(SuiCodeLine, { descendants: true });
  protected readonly copyButtonRef: SuiTemplate<SuiCodeCopyButton> = contentChild(SuiCodeCopyButton, { read: TemplateRef });
  protected readonly copyIconRef: SuiTemplate<SuiCodeCopyIcon> = contentChild(SuiCodeCopyIcon, { read: TemplateRef });
  protected readonly copiedIconRef: SuiTemplate<SuiCodeCopiedIcon> = contentChild(SuiCodeCopiedIcon, { read: TemplateRef });

  protected readonly isCopied: WritableSignal<boolean> = signal<boolean>(false);
  public readonly copyable: SuiBooleanInput = input<boolean, SuiBooleanInputValue>(true, { transform: booleanAttribute });
  public readonly cooldown: InputSignal<number> = input(1200);

  protected readonly copyButtonContext: SuiCodeCopyButtonContext = {
    $implicit: (): void => this.handleCopy(),
    copy: (): void => this.handleCopy(),
    isCopied: this.isCopied,
  };

  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  protected handleCopy(): void {
    const text: string = this.getCodeLines();
    if (!text) return;

    const isSuccessful: boolean = this.clipboard.copy(text);
    if (!isSuccessful) return;

    this.isCopied.set(true);
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout((): void => this.isCopied.set(false), this.cooldown());
  }

  private getCodeLines(): string {
    const lines: string[] = this.lines().map((line: SuiCodeLine): string => line.text());
    return lines.join('\n').trimEnd();
  }
}
