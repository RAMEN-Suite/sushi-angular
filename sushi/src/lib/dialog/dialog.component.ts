import { FocusMonitor } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  model,
  type ModelSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  viewChild,
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LucideX } from '@lucide/angular';
import { type Subscription } from 'rxjs';
import { type DialogCloseEvent, type DialogCloseReason, type DialogMotion, type DialogPosition } from './dialog.interfaces';

let nextDialogId: number = 0;

/** Adds controlled modal behavior to the native dialog element. */
@Component({
  selector: 'sui-dialog',
  exportAs: 'suiDialog',
  imports: [CdkDrag, CdkDragHandle, LucideX],
  host: {
    class: 'sui-dialog-host',
    '[attr.draggable]': 'null',
    '(window:resize)': 'handleViewportResize()',
  },
  template: `
    <dialog
      cdkDrag
      #nativeDialog
      class="sui-dialog"
      [class.sui-dialog--resizable]="resizable()"
      [attr.data-motion]="motion()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.data-position]="namedPosition()"
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
        <button type="button" class="sui-dialog-header__action" [attr.aria-label]="closeLabel()" (click)="close('', 'close')">
          <svg lucideX aria-hidden="true"></svg>
        </button>
      </div>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  /** Requested open state. Setting false starts exit motion; closed emits after the native Dialog closes. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);
  /** Opens the Dialog with modal interaction and a native backdrop. */
  public readonly modal: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Allows Escape to close the Dialog. */
  public readonly closeOnEscape: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Allows a click on the modal backdrop to close the Dialog. */
  public readonly closeOnBackdrop: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Named placement or viewport offsets (numbers in pixels, strings in CSS units). Changes reposition an open Dialog; reopening restores this position after dragging. Custom offsets must leave room for the Dialog. */
  public readonly position: InputSignal<DialogPosition> = input<DialogPosition>('center');
  /** Accessible name used when no visible heading labels the Dialog. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the visible element that labels the Dialog. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that describes the Dialog. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);
  /** Accessible label of the built-in close button. Bind translated text to localise it. */
  public readonly closeLabel: InputSignal<string> = input<string>('Close');
  /** Enables dragging from the Dialog header. */
  public readonly draggable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps the Dialog inside the viewport after dragging and viewport changes. Disable only when off-screen placement is intentional. */
  public readonly constrainToViewport: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Enables native pointer resizing from the bottom-right corner. */
  public readonly resizable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Optional Dialog and backdrop fade. CSS tokens configure timing; reduced motion disables it. */
  public readonly motion: InputSignal<DialogMotion> = input<DialogMotion>('none');
  /** Emits after the native Dialog closes, including any configured exit motion. */
  public readonly closed: OutputEmitterRef<DialogCloseEvent> = output<DialogCloseEvent>();

  private readonly drag: Signal<CdkDrag> = viewChild.required(CdkDrag);
  private readonly element: Signal<ElementRef<HTMLDialogElement>> =
    viewChild.required<ElementRef<HTMLDialogElement>>('nativeDialog');

  /** Stable ID referenced by Dialog triggers. */
  public readonly dialogId: string = `sui-dialog-${++nextDialogId}`;

  protected readonly namedPosition: Signal<string | null> = computed((): string | null => {
    const position: DialogPosition = this.position();
    return typeof position === 'string' ? position : null;
  });
  private readonly document: Document = inject(DOCUMENT);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dragSubscription: Subscription | null = null;
  private closeReason: DialogCloseReason = 'programmatic';
  private readonly focusMonitor: FocusMonitor = inject(FocusMonitor);
  private restoreTarget: HTMLElement | null = null;
  private pendingClose: object | null = null;
  private appliedPosition: DialogPosition | null = null;

  public constructor() {
    afterRenderEffect({
      write: (): void => {
        const drag: CdkDrag = this.drag();
        drag.disabled = !this.draggable();
        drag.boundaryElement = this.constrainToViewport() ? this.document.documentElement : '';
        this.connectDrag(drag);
        this.syncOpenState();
      },
    });
  }

  /** Reapplies the configured position to an open Dialog and resets its drag offset, without reopening or changing focus. Does nothing while closed or closing. */
  public reposition(): void {
    if (!this.element().nativeElement.open || this.pendingClose) return;

    this.applyPosition();
    this.constrainPosition();
    this.updateResizeBounds();
  }

  /** Opens the Dialog and remembers where focus should return. */
  public show(restoreTarget?: HTMLElement): void {
    this.cancelClosing();
    if (this.element().nativeElement.open) {
      this.open.set(true);
      return;
    }

    this.restoreTarget = restoreTarget ?? this.activeElement();
    this.open.set(true);
  }

  /** Closes the Dialog with an optional return value. */
  public close(returnValue: string = '', reason: DialogCloseReason = 'programmatic'): void {
    const dialog: HTMLDialogElement = this.element().nativeElement;
    if (!dialog.open || this.pendingClose) return;

    this.closeReason = reason;
    this.open.set(false);
    if (this.motion() === 'none') {
      dialog.close(returnValue);
      return;
    }

    const request: object = {};
    this.pendingClose = request;
    dialog.setAttribute('data-closing', '');
    const animations: readonly Animation[] = dialog
      .getAnimations()
      .filter(
        (animation: Animation): boolean =>
          'animationName' in animation &&
          typeof animation.animationName === 'string' &&
          animation.animationName.startsWith('sui-dialog-'),
      );
    if (animations.length === 0) {
      dialog.close(returnValue);
      return;
    }

    void Promise.allSettled(animations.map((animation: Animation): Promise<Animation> => animation.finished)).then((): void => {
      if (this.pendingClose === request && !this.destroyRef.destroyed) dialog.close(returnValue);
    });
  }

  /** Toggles the Dialog. */
  public toggle(restoreTarget?: HTMLElement): void {
    if (this.element().nativeElement.open && !this.pendingClose) this.close();
    else this.show(restoreTarget);
  }

  protected handleCancel(event: Event): void {
    event.preventDefault();
    if (this.closeOnEscape()) this.close('', 'escape');
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (this.modal() && this.closeOnBackdrop() && this.isBackdropClick(event)) this.close('', 'backdrop');
  }

  protected handleClose(): void {
    this.cancelClosing();
    this.open.set(false);
    this.closed.emit({ reason: this.closeReason, returnValue: this.element().nativeElement.returnValue });
    this.closeReason = 'programmatic';
    this.drag().reset();
    this.resetPosition();
    this.restoreFocus();
  }

  protected handleViewportResize(): void {
    if (!this.element().nativeElement.open) return;
    const offset: Readonly<{ x: number; y: number }> = this.drag().getFreeDragPosition();
    this.applyPosition();
    this.drag().setFreeDragPosition(offset);
    this.constrainPosition();
    this.updateResizeBounds();
  }

  private connectDrag(drag: CdkDrag): void {
    if (this.dragSubscription) return;
    this.dragSubscription = drag.ended.subscribe((): void => this.updateResizeBounds());
    this.destroyRef.onDestroy(() => this.dragSubscription?.unsubscribe());
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
    if (target) this.focusMonitor.focusVia(target, 'program', { preventScroll: true });
  }

  private cancelClosing(): void {
    this.pendingClose = null;
    this.element().nativeElement.removeAttribute('data-closing');
  }

  private syncOpenState(): void {
    const dialog: HTMLDialogElement = this.element().nativeElement;
    const position: DialogPosition = this.position();

    if (this.open() && this.pendingClose) this.cancelClosing();
    if (this.open() === dialog.open) {
      if (dialog.open && position !== this.appliedPosition) this.reposition();
      return;
    }

    if (this.open()) {
      this.restoreTarget ??= this.activeElement();
      if (this.modal()) dialog.showModal();
      else dialog.show();
      this.applyPosition();
    } else {
      this.close();
    }
  }

  private applyPosition(): void {
    this.drag().reset();
    this.resetPosition();
    const position: DialogPosition = this.position();

    if (typeof position !== 'string') {
      const style: CSSStyleDeclaration = this.element().nativeElement.style;
      style.inset = 'auto';
      style.margin = '0';
      for (const edge of ['top', 'right', 'bottom', 'left'] as const) {
        const value: number | string | undefined = position[edge];
        if (value !== undefined) style[edge] = typeof value === 'number' ? `${value}px` : value;
      }
    }

    this.lockPosition();
    this.appliedPosition = position;
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
    dialog.style.maxWidth = `max(0px, calc(100vw - ${bounds.left}px - var(--sui-dialog-viewport-gap)))`;
    dialog.style.maxHeight = `max(0px, calc(100dvh - ${bounds.top}px - var(--sui-dialog-viewport-gap)))`;
  }

  private constrainPosition(): void {
    if (!this.constrainToViewport()) return;
    const dialog: HTMLDialogElement = this.element().nativeElement;
    const viewport: Window | null = dialog.ownerDocument.defaultView;
    if (!viewport) return;

    const bounds: DOMRect = dialog.getBoundingClientRect();
    const offset: Readonly<{ x: number; y: number }> = this.drag().getFreeDragPosition();
    const left: number = Math.max(0, Math.min(bounds.left, viewport.innerWidth - bounds.width));
    const top: number = Math.max(0, Math.min(bounds.top, viewport.innerHeight - bounds.height));
    this.drag().setFreeDragPosition({ x: offset.x + left - bounds.left, y: offset.y + top - bounds.top });
  }
}
