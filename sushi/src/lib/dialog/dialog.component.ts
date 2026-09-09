import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { DialogCloseEvent, DialogCloseReason, DialogPosition } from './dialog.interfaces';

let nextDialogId: number = 0;

@Component({
  selector: 'sui-dialog',
  exportAs: 'suiDialog',
  imports: [CdkDrag, CdkDragHandle],
  host: {
    class: 'sui-dialog-host',
    '[attr.draggable]': 'null',
  },
  template: `
    <dialog
      cdkDrag
      #nativeDialog
      class="sui-dialog"
      [class.sui-dialog--resizable]="resizable()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.data-position]="position()"
      [attr.data-draggable]="draggable()"
      [id]="dialogId"
      (cancel)="handleCancel($event)"
      (pointerdown)="handlePointerDown($event)"
      (close)="handleClose()"
    >
      <div cdkDragHandle class="sui-dialog-drag-region"><ng-content select="[suiDialogHeader]" /></div>
      <ng-content select="[suiDialogBody]" />
      <ng-content />
      <ng-content select="[suiDialogFooter]" />
      <div class="sui-dialog-header__actions">
        <button type="button" class="sui-dialog-header__action" aria-label="Close" (click)="close('', 'close')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  /** Accessible name used when no visible heading labels the Dialog. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the visible element that labels the Dialog. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that describes the Dialog. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);
  /** Enables dragging from the Dialog header. */
  public readonly draggable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps a draggable Dialog inside the viewport. Disable only when off-screen placement is intentional. */
  public readonly constrainToViewport: InputSignalWithTransform<boolean, unknown> = input(true, {
    transform: booleanAttribute,
  });
  /** Enables native pointer resizing from the bottom-right corner. */
  public readonly resizable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Emits after the native Dialog closes. */
  public readonly closed: OutputEmitterRef<DialogCloseEvent> = output<DialogCloseEvent>();

  /** Stable ID referenced by Dialog triggers. */
  public readonly dialogId: string = `sui-dialog-${++nextDialogId}`;

  private readonly element: Signal<ElementRef<HTMLDialogElement>> =
    viewChild.required<ElementRef<HTMLDialogElement>>('nativeDialog');
  private readonly document: Document = inject(DOCUMENT);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dragEnded: Subscription | null = null;
  private closeReason: DialogCloseReason = 'programmatic';
  private readonly drag: Signal<CdkDrag> = viewChild.required(CdkDrag);
  private restoreTarget: HTMLElement | null = null;

  public constructor() {
    afterRenderEffect({
      write: (): void => {
        const drag: CdkDrag = this.drag();
        drag.disabled = !this.draggable();
        drag.boundaryElement = this.constrainToViewport() ? this.document.documentElement : '';
        if (!this.dragEnded) {
          this.dragEnded = drag.ended.subscribe((): void => this.updateResizeBounds());
          this.destroyRef.onDestroy((): void => this.dragEnded?.unsubscribe());
        }
        this.syncOpenState();
      },
    });
  }

  /** Opens the Dialog and remembers where focus should return. */
  public show(restoreTarget?: HTMLElement): void {
    if (this.element().nativeElement.open) return;
    this.restoreTarget = restoreTarget ?? this.activeElement();
    this.open.set(true);
  }

  /** Closes the Dialog with an optional return value. */
  public close(returnValue: string = '', reason: DialogCloseReason = 'programmatic'): void {
    if (!this.element().nativeElement.open) return;
    this.closeReason = reason;
    this.element().nativeElement.close(returnValue);
  }

  /** Toggles the Dialog. */
  public toggle(restoreTarget?: HTMLElement): void {
    if (this.element().nativeElement.open) this.close();
    else this.show(restoreTarget);
  }

  protected handleCancel(event: Event): void {
    if (!this.closeOnEscape()) {
      event.preventDefault();
      return;
    }
    this.closeReason = 'escape';
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (this.modal() && this.closeOnBackdrop() && this.isBackdropClick(event)) this.close('', 'backdrop');
  }

  protected handleClose(): void {
    this.open.set(false);
    this.closed.emit({ reason: this.closeReason, returnValue: this.element().nativeElement.returnValue });
    this.closeReason = 'programmatic';
    this.drag().reset();
    this.resetPosition();
    this.restoreFocus();
  }

  private activeElement(): HTMLElement | null {
    const activeElement: Element | null = this.element().nativeElement.ownerDocument.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
  }

  private isBackdropClick(event: MouseEvent): boolean {
    if (event.target !== this.element().nativeElement) return false;
    const bounds: DOMRect = this.element().nativeElement.getBoundingClientRect();
    return (
      event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom
    );
  }

  private restoreFocus(): void {
    const target: HTMLElement | null = this.restoreTarget;
    this.restoreTarget = null;
    target?.focus({ preventScroll: true });
  }

  private syncOpenState(): void {
    const dialog: HTMLDialogElement = this.element().nativeElement;
    if (this.open() === dialog.open) return;
    if (this.open()) {
      this.restoreTarget ??= this.activeElement();
      if (this.modal()) dialog.showModal();
      else dialog.show();
      this.lockPosition();
    } else {
      this.close();
    }
  }

  private lockPosition(): void {
    const dialog: HTMLDialogElement = this.element().nativeElement;
    const bounds: DOMRect = dialog.getBoundingClientRect();
    dialog.style.inset = 'auto';
    dialog.style.margin = '0';
    dialog.style.left = `${bounds.left}px`;
    dialog.style.top = `${bounds.top}px`;
    this.updateResizeBounds();
  }

  private resetPosition(): void {
    const style: CSSStyleDeclaration = this.element().nativeElement.style;
    style.removeProperty('inset');
    style.removeProperty('margin');
    style.removeProperty('left');
    style.removeProperty('top');
    style.removeProperty('max-width');
    style.removeProperty('max-height');
  }

  private updateResizeBounds(): void {
    if (!this.constrainToViewport()) return;
    const dialog: HTMLDialogElement = this.element().nativeElement;
    const viewport: Window | null = dialog.ownerDocument.defaultView;
    if (!viewport) return;
    const bounds: DOMRect = dialog.getBoundingClientRect();
    const gap: number = Number.parseFloat(viewport.getComputedStyle(dialog).getPropertyValue('--sui-dialog-viewport-gap')) || 0;
    dialog.style.maxWidth = `${Math.max(0, viewport.innerWidth - bounds.left - gap)}px`;
    dialog.style.maxHeight = `${Math.max(0, viewport.innerHeight - bounds.top - gap)}px`;
  }
}
