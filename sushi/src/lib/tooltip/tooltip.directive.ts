import {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  numberAttribute,
} from '@angular/core';
import { TooltipSurface } from './internal/tooltip-surface.component';
import { TooltipPlacement } from './tooltip.interfaces';

let nextTooltipId: number = 0;

const POSITIONS: Record<TooltipPlacement, ConnectedPosition[]> = {
  top: [{ originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -1 }],
  right: [{ originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 1 }],
  bottom: [{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 1 }],
  left: [{ originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -1 }],
};

const PLACEMENTS: readonly TooltipPlacement[] = ['top', 'right', 'bottom', 'left'];

function resolvePlacement(position: ConnectedPosition): TooltipPlacement {
  if (position.overlayY === 'bottom') return 'top';
  if (position.overlayY === 'top') return 'bottom';
  if (position.overlayX === 'start') return 'right';
  return 'left';
}

function createPosition(placement: TooltipPlacement, offset: number): ConnectedPosition {
  const position: ConnectedPosition = POSITIONS[placement][0];
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
    '(mouseenter)': 'scheduleShow()',
    '(mouseleave)': 'scheduleHide()',
    '(focusin)': 'scheduleShow()',
    '(focusout)': 'scheduleHide()',
    '(keydown.escape)': 'hide()',
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
  /** Delay in milliseconds before the Tooltip appears. */
  public readonly showDelay: InputSignalWithTransform<number, unknown> = input(300, { transform: numberAttribute });
  /** Delay in milliseconds before the Tooltip disappears. */
  public readonly hideDelay: InputSignalWithTransform<number, unknown> = input(100, { transform: numberAttribute });

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
  private previousDescription: string | null = null;

  public constructor() {
    this.destroyRef.onDestroy((): void => this.destroy());
  }

  /** Shows the Tooltip immediately. */
  public show(): void {
    this.clearTimers();
    if (this.disabled() || this.overlayRef?.hasAttached()) return;
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

  protected scheduleShow(): void {
    this.clearTimers();
    this.showTimer = setTimeout((): void => this.show(), Math.max(0, this.showDelay()));
  }

  protected scheduleHide(): void {
    this.clearTimers();
    this.hideTimer = setTimeout((): void => this.hide(), Math.max(0, this.hideDelay()));
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
    const target: HTMLElement = this.element.nativeElement;
    if (this.previousDescription) target.setAttribute('aria-describedby', this.previousDescription);
    else target.removeAttribute('aria-describedby');
    this.previousDescription = null;
  }

  private clearTimers(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.showTimer = null;
    this.hideTimer = null;
  }

  private destroy(): void {
    this.clearTimers();
    this.restoreDescription();
    this.overlayRef?.dispose();
    this.configuredPlacement = null;
    this.configuredOffset = null;
  }
}
