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
import { LucideCircleCheck, LucideCircleX, LucideDynamicIcon, LucideInfo, LucideTriangleAlert, LucideX } from '@lucide/angular';
import type { LucideIconData } from '@lucide/angular';
import { Button } from '../button';
import { Message, MessageSeverity } from '../message';
import { positiveInteger } from '../number.transforms';
import { ToastHorizontalPosition, ToastItem, ToastTemplateContext, ToastVerticalPosition } from './toast.interfaces';
import { ToastService } from './toast.service';
import { ToastContentTemplate } from './toast.templates';

const TOAST_ICONS: Readonly<Record<MessageSeverity | 'neutral', LucideIconData>> = {
  neutral: LucideInfo.icon,
  info: LucideInfo.icon,
  success: LucideCircleCheck.icon,
  warning: LucideTriangleAlert.icon,
  error: LucideCircleX.icon,
};

@Component({
  selector: 'sui-toast',
  imports: [Button, LucideDynamicIcon, LucideX, Message, NgTemplateOutlet],
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

  protected icon(item: ToastItem): LucideIconData {
    return TOAST_ICONS[item.severity ?? 'neutral'];
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
