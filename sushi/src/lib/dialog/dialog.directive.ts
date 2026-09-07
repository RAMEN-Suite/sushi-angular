import {
  afterRenderEffect,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DialogCloseEvent, DialogCloseReason, DialogPosition } from './dialog.interfaces';

let nextDialogId: number = 0;

@Directive({
  selector: 'dialog[suiDialog]',
  exportAs: 'suiDialog',
  hostDirectives: [CdkDrag],
  host: {
    class: 'sui-dialog',
    '[class.sui-dialog--resizable]': 'resizable()',
    '[class.sui-dialog--maximized]': 'maximized()',
    '[attr.data-position]': 'position()',
    '(cancel)': 'handleCancel($event)',
    '(click)': 'handleClick($event)',
    '(close)': 'handleClose()',
  },
})
/** Adds controlled modal behavior to the native dialog element. */
export class Dialog {
  /** Controls and reports whether the Dialog is open. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);
  /** Opens the Dialog with modal interaction and a native backdrop. */
  public readonly modal: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Allows Escape to close the Dialog. */
  public readonly closeOnEscape: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Allows a click on the modal backdrop to close the Dialog. */
  public readonly closeOnBackdrop: InputSignalWithTransform<boolean, unknown> = input(true, {
    transform: booleanAttribute,
  });
  /** Places the Dialog at a viewport edge or corner. */
  public readonly position: InputSignal<DialogPosition> = input<DialogPosition>('center');
  /** Enables dragging. Add `suiDialogDragHandle` to the intended handle. */
  public readonly draggable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Enables native pointer resizing from the bottom-right corner. */
  public readonly resizable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Controls the maximized viewport state. */
  public readonly maximized: ModelSignal<boolean> = model<boolean>(false);
  /** Emits after the native Dialog closes. */
  public readonly closed: OutputEmitterRef<DialogCloseEvent> = output<DialogCloseEvent>();

  /** Stable ID referenced by Dialog triggers. */
  public readonly dialogId: string = `sui-dialog-${++nextDialogId}`;

  private readonly element: ElementRef<HTMLDialogElement> = inject<ElementRef<HTMLDialogElement>>(ElementRef);
  private readonly drag: CdkDrag = inject(CdkDrag);
  private closeReason: DialogCloseReason = 'programmatic';
  private restoreTarget: HTMLElement | null = null;

  public constructor() {
    this.element.nativeElement.id ||= this.dialogId;
    afterRenderEffect({
      write: (): void => {
        this.drag.disabled = !this.draggable() || this.maximized();
        this.syncOpenState();
      },
    });
  }

  /** Opens the Dialog modally and remembers where focus should return. */
  public showModal(restoreTarget?: HTMLElement): void {
    if (this.element.nativeElement.open) return;
    this.restoreTarget = restoreTarget ?? this.activeElement();
    this.open.set(true);
  }

  /** Closes the Dialog with an optional return value. */
  public close(returnValue: string = '', reason: DialogCloseReason = 'programmatic'): void {
    if (!this.element.nativeElement.open) return;
    this.closeReason = reason;
    this.element.nativeElement.close(returnValue);
  }

  /** Toggles the modal Dialog. */
  public toggle(restoreTarget?: HTMLElement): void {
    if (this.element.nativeElement.open) this.close();
    else this.showModal(restoreTarget);
  }

  /** Toggles the maximized state and resets a previous drag offset. */
  public toggleMaximize(): void {
    this.drag.reset();
    this.maximized.update((value: boolean): boolean => !value);
  }

  protected handleCancel(event: Event): void {
    if (!this.closeOnEscape()) {
      event.preventDefault();
      return;
    }
    this.closeReason = 'escape';
  }

  protected handleClick(event: MouseEvent): void {
    if (event.target === this.element.nativeElement && this.modal() && this.closeOnBackdrop()) this.close('', 'backdrop');
  }

  protected handleClose(): void {
    this.open.set(false);
    this.closed.emit({ reason: this.closeReason, returnValue: this.element.nativeElement.returnValue });
    this.closeReason = 'programmatic';
    this.drag.reset();
    this.restoreFocus();
  }

  private activeElement(): HTMLElement | null {
    const activeElement: Element | null = this.element.nativeElement.ownerDocument.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
  }

  private restoreFocus(): void {
    const target: HTMLElement | null = this.restoreTarget;
    this.restoreTarget = null;
    target?.focus({ preventScroll: true });
  }

  private syncOpenState(): void {
    const dialog: HTMLDialogElement = this.element.nativeElement;
    if (this.open() === dialog.open) return;
    if (this.open()) {
      this.restoreTarget ??= this.activeElement();
      if (this.modal()) dialog.showModal();
      else dialog.show();
    } else {
      this.close();
    }
  }
}
