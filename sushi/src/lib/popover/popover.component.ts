import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin,
} from '@angular/cdk/overlay';
import { LucideX } from '@lucide/angular';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ElementRef,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  numberAttribute,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { Button } from '../button';
import { PopoverPlacement } from './popover.interfaces';

let nextPopoverId: number = 0;

const BASE_POSITIONS: Record<PopoverPlacement, ConnectedPosition[]> = {
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 1 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -1 },
  ],
  top: [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -1 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 1 },
  ],
  right: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 1 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -1 },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -1 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 1 },
  ],
};

function createPositions(placement: PopoverPlacement, offset: number): ConnectedPosition[] {
  return BASE_POSITIONS[placement].map((position: ConnectedPosition): ConnectedPosition => ({
    ...position,
    offsetX: position.offsetX ? Math.sign(position.offsetX) * offset : undefined,
    offsetY: position.offsetY ? Math.sign(position.offsetY) * offset : undefined,
  }));
}

/** Displays projected supporting content beside a trigger without blocking the page. */
@Component({
  selector: 'sui-popover',
  exportAs: 'suiPopover',
  imports: [Button, CdkConnectedOverlay, LucideX],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin()!"
      [cdkConnectedOverlayOpen]="open() && !!origin()"
      [cdkConnectedOverlayPositions]="positions()"
      [cdkConnectedOverlayHasBackdrop]="dismissible()"
      [cdkConnectedOverlayBackdropClass]="'cdk-overlay-transparent-backdrop'"
      [cdkConnectedOverlayPush]="true"
      [cdkConnectedOverlayViewportMargin]="8"
      (backdropClick)="hide()"
      (attach)="handleAttach()"
      (overlayKeydown)="handleKeydown($event)"
      (positionChange)="handlePositionChange($event)"
      (detach)="open.set(false)"
    >
      <div
        #surface
        class="sui-popover"
        role="dialog"
        [class.sui-popover--closable]="showCloseButton()"
        [attr.data-placement]="resolvedPlacement()"
        [id]="popoverId"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        tabindex="-1"
        [style.--_sui-popover-arrow-x]="arrowX()"
        [style.--_sui-popover-arrow-y]="arrowY()"
      >
        @if (showCloseButton()) {
          <button
            suiButton
            type="button"
            size="sm"
            shape="square"
            severity="neutral"
            variant="text"
            class="sui-popover__close"
            aria-label="Close"
            (click)="hide(true)"
          >
            <svg lucideX class="size-4" aria-hidden="true"></svg>
          </button>
        }
        <ng-content />
      </div>
    </ng-template>
  `,
  styleUrl: './popover.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popover {
  /** Controls and reports whether the Popover is visible. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);
  /** Preferred side relative to the trigger, with automatic fallback. */
  public readonly placement: InputSignal<PopoverPlacement> = input<PopoverPlacement>('bottom');
  /** Space in pixels between the trigger and the Popover surface. */
  public readonly offset: InputSignalWithTransform<number, unknown> = input(10, { transform: numberAttribute });
  /** Accessible name for the Popover surface. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the visible element that labels the Popover. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Allows pointer interaction outside the Popover to close it. */
  public readonly dismissible: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Allows Escape to close the Popover independently of outside dismissal. */
  public readonly closeOnEscape: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Displays a close action in the top-right corner. */
  public readonly showCloseButton: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Moves focus to the Popover surface when it opens. */
  public readonly autoFocus: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  /** Stable ID referenced by Popover triggers. */
  public readonly popoverId: string = `sui-popover-${++nextPopoverId}`;

  protected readonly origin: WritableSignal<FlexibleConnectedPositionStrategyOrigin | undefined> = signal(undefined);
  protected readonly positions: Signal<ConnectedPosition[]> = computed(() => createPositions(this.placement(), this.offset()));
  protected readonly resolvedPlacement: WritableSignal<PopoverPlacement> = signal<PopoverPlacement>('bottom');
  protected readonly arrowX: WritableSignal<string> = signal<string>('50%');
  protected readonly arrowY: WritableSignal<string> = signal<string>('50%');
  private readonly surface: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('surface');
  private restoreTarget: HTMLElement | null = null;

  /** Opens the Popover beside an element. */
  public show(origin: HTMLElement): void {
    this.origin.set(origin);
    this.restoreTarget = origin;
    this.open.set(true);
  }

  /** Closes the Popover and optionally restores trigger focus. */
  public hide(restoreFocus: boolean = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (restoreFocus) this.restoreTarget?.focus({ preventScroll: true });
  }

  /** Toggles the Popover beside an element. */
  public toggle(origin: HTMLElement): void {
    if (this.open()) this.hide();
    else this.show(origin);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.closeOnEscape() || event.key !== 'Escape') return;
    event.preventDefault();
    this.hide(true);
  }

  protected handleAttach(): void {
    if (!this.autoFocus()) return;
    queueMicrotask((): void => this.surface()?.nativeElement.focus({ preventScroll: true }));
  }

  protected handlePositionChange(event: ConnectedOverlayPositionChange): void {
    const position: ConnectedPosition = event.connectionPair;
    if (position.overlayY === 'top') this.resolvedPlacement.set('bottom');
    else if (position.overlayY === 'bottom') this.resolvedPlacement.set('top');
    else if (position.overlayX === 'start') this.resolvedPlacement.set('right');
    else this.resolvedPlacement.set('left');

    queueMicrotask((): void => this.updateArrowPosition());
  }

  private updateArrowPosition(): void {
    const surface: HTMLElement | undefined = this.surface()?.nativeElement;
    if (!surface || !this.restoreTarget) return;

    const surfaceRect: DOMRect = surface.getBoundingClientRect();
    const originRect: DOMRect = this.restoreTarget.getBoundingClientRect();
    const inset: number = 16;
    const x: number = originRect.left + originRect.width / 2 - surfaceRect.left;
    const y: number = originRect.top + originRect.height / 2 - surfaceRect.top;

    this.arrowX.set(`${Math.min(Math.max(x, inset), surfaceRect.width - inset)}px`);
    this.arrowY.set(`${Math.min(Math.max(y, inset), surfaceRect.height - inset)}px`);
  }
}
