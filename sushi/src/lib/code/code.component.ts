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
import { SuiBooleanAttribute, SuiBooleanInput, SuiTemplateSignal } from '../sushi.types';
import { SuiCodeLine } from './code-line.directive';
import { SuiCodeCopiedIcon, SuiCodeCopyIcon } from './code-icon.directive';
import { SuiButton } from '../button';

@Component({
  selector: 'sui-code',
  standalone: true,
  imports: [NgTemplateOutlet, LucideCopy, LucideCheck, SuiButton],
  host: {
    class: 'mockup-code sui-code-control relative block',
  },
  templateUrl: './code.component.html',
  styleUrl: './code.component.css',
})
export class SuiCode {
  protected readonly clipboard: Clipboard = inject(Clipboard);
  protected readonly copied: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly lines: Signal<readonly SuiCodeLine[]> = contentChildren(SuiCodeLine, { descendants: true });
  protected readonly copyIcon: SuiTemplateSignal<SuiCodeCopyIcon> = contentChild(SuiCodeCopyIcon, { read: TemplateRef });
  protected readonly copiedIcon: SuiTemplateSignal<SuiCodeCopiedIcon> = contentChild(SuiCodeCopiedIcon, { read: TemplateRef });

  public readonly ariaLabel: InputSignal<string> = input<string>('');
  public readonly copyable: SuiBooleanInput = input<boolean, SuiBooleanAttribute>(true, { transform: booleanAttribute });

  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  protected copy(): void {
    const text: string = this.getCodeText();
    if (!text) return;

    const success: boolean = this.clipboard.copy(text);
    if (!success) return;

    this.copied.set(true);
    if (this.resetTimer) clearTimeout(this.resetTimer);

    this.resetTimer = setTimeout((): void => this.copied.set(false), 1200);
  }

  private getCodeText(): string {
    const lines: string[] = this.lines().map((line: SuiCodeLine): string => line.text());
    return lines.join('\n').trimEnd();
  }
}
