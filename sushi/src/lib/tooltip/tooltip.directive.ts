import { FocusMonitor, type FocusOrigin } from '@angular/cdk/a11y';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type ConnectedOverlayPositionChange,
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  computed,
  effect,
  type Signal,
  Renderer2,
  type ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  numberAttribute,
} from '@angular/core';
import { OVERLAY_TRIGGER_OPEN } from '../internal/overlay-trigger-state';
import { TooltipSurface } from './internal/tooltip-surface.component';
import { type TooltipPlacement } from './tooltip.interfaces';

let nextTooltipId: number = 0;

const POSITIONS: Record<TooltipPlacement, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -1 },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 1 },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 1 },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -1 },
};

const PLACEMENTS: readonly TooltipPlacement[] = ['top', 'right', 'bottom', 'left'];

function resolvePlacement(position: ConnectedPosition): TooltipPlacement {
  if (position.overlayY === 'bottom') return 'top';
  if (position.overlayY === 'top') return 'bottom';
  if (position.overlayX === 'start') return 'right';
  return 'left';
}

function createPosition(placement: TooltipPlacement, offset: number): ConnectedPosition {
  const position: ConnectedPosition = POSITIONS[placement];
  return {
    ...position,
    offsetX: position.offsetX ? Math.sign(position.offsetX) * offset : undefined,
    offsetY: position.offsetY ? Math.sign(position.offsetY) * offset : undefined,
  };
}

/** Adds accessible hover and focus help to an element. */
@Directive({
  selector: '[suiTooltip]',
  host: {
    '(mouseenter)': 'handlePointerEnter($event)',
    '(mouseleave)': 'handlePointerLeave($event)',
    '(pointerdown)': 'handleActivation()',
    '(click)': 'handleActivation()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class Tooltip {
  /** Plain-text content displayed by the Tooltip. */
  public readonly text: InputSignal<string> = input.required<string>({ alias: 'suiTooltip' });
  /** Preferred side of the target, with automatic viewport fallback. */
  public readonly placement: InputSignal<TooltipPlacement> = input<TooltipPlacement>('top');
  /** Space in pixels between the target and Tooltip. */
  public readonly offset: InputSignalWithTransform<number, unknown> = input(6, { transform: numberAttribute });
  /** Prevents the Tooltip from opening. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Suspends the Tooltip during external work, hiding it and cancelling pending timers. Resuming does not open it; a fresh hover or keyboard focus is required. */
  public readonly suspended: InputSignalWithTransform<boolean, unknown> = input(false, {
    alias: 'suiTooltipSuspended',
    transform: booleanAttribute,
  });
  /** Delay in milliseconds before the Tooltip appears. */
  public readonly showDelay: InputSignalWithTransform<number, unknown> = input(300, { transform: numberAttribute });
  /** Delay in milliseconds before the Tooltip disappears. */
  public readonly hideDelay: InputSignalWithTransform<number, unknown> = input(100, { transform: numberAttribute });

  private readonly overlayOpen: Signal<boolean> | null = inject(OVERLAY_TRIGGER_OPEN, { optional: true, self: true });
  private readonly focusMonitor: FocusMonitor = inject(FocusMonitor);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly blocked: Signal<boolean> = computed(
    (): boolean => this.disabled() || this.suspended() || this.overlayOpen?.() === true,
  );
  private wasBlocked: boolean = false;
  private pointerSuppressed: boolean = false;
  private pendingHover: boolean = false;
  private keyboardSuppressed: boolean = false;
  private stopKeyboardTracking: (() => void) | null = null;
  private pointer: Readonly<{ x: number; y: number }> | null = null;
  private stopPointerTracking: (() => void) | null = null;
  private readonly id: string = `sui-tooltip-${++nextTooltipId}`;
  private readonly element: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay: Overlay = inject(Overlay);
  private readonly positionBuilder: OverlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private overlayRef: OverlayRef | null = null;
  private surfaceRef: ComponentRef<TooltipSurface> | null = null;
  private configuredPlacement: TooltipPlacement | null = null;
  private configuredOffset: number | null = null;
  private resolvedPlacement: TooltipPlacement = 'top';
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private previousDescription: string | null | undefined;

  public constructor() {
    this.focusMonitor
      .monitor(this.element, true)
      .pipe(takeUntilDestroyed())
      .subscribe((origin: FocusOrigin): void => {
        this.handleFocus(origin);
      });
    effect((): void => {
      const blocked: boolean = this.blocked();
      if (blocked || this.wasBlocked) this.handleActivation();
      this.wasBlocked = blocked;
    });
    this.destroyRef.onDestroy((): void => this.destroy());
  }

  /** Shows the Tooltip immediately unless disabled, suspended or its associated Sushi overlay is open. */
  public show(): void {
    this.clearTimers();
    if (this.blocked() || this.overlayRef?.hasAttached()) return;
    if (this.overlayRef && (this.configuredPlacement !== this.placement() || this.configuredOffset !== this.offset())) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    if (!this.overlayRef) this.createOverlay();
    const overlayRef: OverlayRef | null = this.overlayRef;
    if (!overlayRef) return;
    this.surfaceRef = overlayRef.attach(new ComponentPortal(TooltipSurface));
    this.surfaceRef.setInput('text', this.text());
    this.surfaceRef.setInput('surfaceId', this.id);
    this.surfaceRef.setInput('placement', this.resolvedPlacement);
    this.addDescription();
  }

  /** Hides the Tooltip immediately. */
  public hide(): void {
    this.clearTimers();
    this.overlayRef?.detach();
    this.surfaceRef = null;
    this.restoreDescription();
  }

  protected handleActivation(): void {
    this.hide();
    this.keyboardSuppressed = true;
    this.trackKeyboardNavigation();
    this.pointerSuppressed = this.pointer === null || this.containsPointer(this.pointer);
    this.pendingHover = false;
    this.stopPointerTracking ??= this.renderer.listen(
      this.element.nativeElement.ownerDocument,
      'pointermove',
      (event: PointerEvent): void => this.trackPointer(event),
    );
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const button: boolean = this.element.nativeElement.matches('button, [role="button"]');
    if (
      event.key === 'Escape' ||
      (button && ['Enter', ' '].includes(event.key)) ||
      (event.key === 'ArrowDown' && this.overlayOpen)
    ) {
      this.handleActivation();
    }
  }

  protected handlePointerEnter(event: MouseEvent): void {
    this.pendingHover = true;
    if (this.pointerSuppressed || this.blocked()) return;
    this.pointer = { x: event.clientX, y: event.clientY };
    this.scheduleShow();
  }

  protected handlePointerLeave(event: MouseEvent): void {
    this.pointer = { x: event.clientX, y: event.clientY };
    this.pendingHover = false;
    if (!this.blocked() && !this.containsPointer(this.pointer)) this.releasePointer();
    this.scheduleHide();
  }

  protected scheduleShow(): void {
    this.clearTimers();
    if (this.blocked()) return;
    this.showTimer = setTimeout((): void => this.show(), Math.max(0, this.showDelay()));
  }

  protected scheduleHide(): void {
    this.clearTimers();
    this.hideTimer = setTimeout((): void => this.hide(), Math.max(0, this.hideDelay()));
  }

  private handleFocus(origin: FocusOrigin): void {
    if (origin === 'keyboard' && !this.keyboardSuppressed && !this.blocked()) this.scheduleShow();
    else if (origin === 'program') this.handleActivation();
    else if (origin === null) this.scheduleHide();
  }

  private trackKeyboardNavigation(): void {
    // Native dialogs can return focus with the CDK's previous keyboard origin. Require a fresh navigation key.
    if (this.stopKeyboardTracking) return;
    this.stopKeyboardTracking = this.renderer.listen(
      this.element.nativeElement.ownerDocument,
      'keydown',
      (event: KeyboardEvent): void => {
        if (!['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        this.keyboardSuppressed = false;
        this.stopKeyboardTracking?.();
        this.stopKeyboardTracking = null;
      },
    );
  }

  private trackPointer(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    // A disappearing overlay can synthesize mouseenter without a deliberate pointer entry.
    const previous: Readonly<{ x: number; y: number }> | null = this.pointer;
    this.pointer = { x: event.clientX, y: event.clientY };
    if (this.blocked()) return;

    const inside: boolean = this.containsPointer(this.pointer);
    if (!inside) this.releasePointer();
    else if (this.pendingHover && (!previous || !this.containsPointer(previous))) {
      this.releasePointer();
      this.scheduleShow();
    }
  }

  private containsPointer(point: Readonly<{ x: number; y: number }>): boolean {
    const bounds: DOMRect = this.element.nativeElement.getBoundingClientRect();
    return point.x >= bounds.left && point.x < bounds.right && point.y >= bounds.top && point.y < bounds.bottom;
  }

  private releasePointer(): void {
    this.pointerSuppressed = false;
    this.stopPointerTracking?.();
    this.stopPointerTracking = null;
  }

  private addDescription(): void {
    const target: HTMLElement = this.element.nativeElement;
    this.previousDescription = target.getAttribute('aria-describedby');
    const ids: string[] = [...(this.previousDescription?.split(/\s+/).filter(Boolean) ?? []), this.id];
    target.setAttribute('aria-describedby', [...new Set(ids)].join(' '));
  }

  private createOverlay(): void {
    this.configuredPlacement = this.placement();
    this.configuredOffset = this.offset();
    this.resolvedPlacement = this.placement();
    const positions: ConnectedPosition[] = [this.placement(), ...PLACEMENTS.filter((item) => item !== this.placement())].flatMap(
      (placement: TooltipPlacement): ConnectedPosition[] => [createPosition(placement, this.offset())],
    );
    const strategy: FlexibleConnectedPositionStrategy = this.positionBuilder
      .flexibleConnectedTo(this.element)
      .withPositions(positions)
      .withPush(true);
    strategy.positionChanges.subscribe((change: ConnectedOverlayPositionChange): void => {
      this.resolvedPlacement = resolvePlacement(change.connectionPair);
      this.surfaceRef?.setInput('placement', this.resolvedPlacement);
    });
    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'sui-tooltip-panel',
    });
  }

  private restoreDescription(): void {
    if (this.previousDescription === undefined) return;

    const target: HTMLElement = this.element.nativeElement;
    if (this.previousDescription === null) target.removeAttribute('aria-describedby');
    else target.setAttribute('aria-describedby', this.previousDescription);
    this.previousDescription = undefined;
  }

  private clearTimers(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.showTimer = null;
    this.hideTimer = null;
  }

  private destroy(): void {
    this.focusMonitor.stopMonitoring(this.element);
    this.releasePointer();
    this.stopKeyboardTracking?.();
    this.clearTimers();
    this.restoreDescription();
    this.overlayRef?.dispose();
    this.configuredPlacement = null;
    this.configuredOffset = null;
  }
}
