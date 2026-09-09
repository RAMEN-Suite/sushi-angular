import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
} from '@angular/core';
import { Button } from '../button';
import { Message, MessageSeverity } from '../message';
import { positiveInteger } from '../number.transforms';
import { ToastHorizontalPosition, ToastItem, ToastTemplateContext, ToastVerticalPosition } from './toast.interfaces';
import { ToastService } from './toast.service';
import { ToastContentTemplate } from './toast.templates';

const TOAST_ICON_PATHS: Readonly<Record<MessageSeverity | 'neutral', string>> = {
  neutral: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6v-4m0-4h.01',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6v-4m0-4h.01',
  success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  warning: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4h.01',
  error: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm3-13-6 6m0-6 6 6',
};

@Component({
  selector: 'sui-toast',
  imports: [Button, Message, NgTemplateOutlet],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  host: { class: 'sui-toast-host' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Renders the queue managed by ToastService at a viewport edge or corner. */
export class Toast {
  /** Horizontal alignment of the Toast stack. */
  public readonly horizontal: InputSignal<ToastHorizontalPosition> = input<ToastHorizontalPosition>('end');
  /** Vertical alignment of the Toast stack. */
  public readonly vertical: InputSignal<ToastVerticalPosition> = input<ToastVerticalPosition>('bottom');
  /** Maximum number of recent Toasts rendered at once. */
  public readonly maxVisible: InputSignalWithTransform<number, unknown> = input(5, { transform: positiveInteger });
  /** Accessible name of the notification region. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Notifications');

  protected readonly service: ToastService = inject(ToastService);
  protected readonly contentTemplates: Signal<readonly ToastContentTemplate[]> = contentChildren(ToastContentTemplate);
  protected readonly visibleToasts: Signal<readonly ToastItem[]> = computed((): readonly ToastItem[] =>
    this.service.toasts().slice(-this.maxVisible()),
  );

  protected handleAction(item: ToastItem): void {
    item.action?.run();
    if (item.action?.dismiss !== false) this.service.dismiss(item.id);
  }

  protected buttonSeverity(item: ToastItem): MessageSeverity | 'neutral' {
    return item.severity ?? 'neutral';
  }

  protected iconPath(item: ToastItem): string {
    return TOAST_ICON_PATHS[item.severity ?? 'neutral'];
  }

  protected contentTemplate(item: ToastItem): ToastContentTemplate | undefined {
    if (!item.template) return undefined;
    return this.contentTemplates().find(
      (template: ToastContentTemplate): boolean => template.suiToastContent() === item.template,
    );
  }

  protected templateContext(item: ToastItem): ToastTemplateContext {
    return {
      $implicit: item,
      dismiss: (): void => this.service.dismiss(item.id),
      runAction: (): void => this.handleAction(item),
    };
  }
}
