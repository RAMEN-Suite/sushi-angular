import { DOCUMENT } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DrawerCloseReason, DrawerPersistentAt, DrawerPlacement, DrawerSize } from './drawer.interfaces';
import { DrawerFooter, DrawerHeader } from './drawer-slots.directive';

let nextDrawerId: number = 0;

const DRAWER_BREAKPOINTS: Readonly<Record<DrawerPersistentAt, string>> = {
  sm: '(min-width: 40rem)',
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
  xl: '(min-width: 80rem)',
};

/** Controls a headless sliding panel as a modal overlay or responsive layout region. */
@Component({
  selector: 'sui-drawer',
  exportAs: 'suiDrawer',
  imports: [CdkTrapFocus],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  host: {
    class: 'drawer sui-drawer',
    '[class.drawer-end]': 'placement() === "end"',
    '[class.sui-drawer--sm]': 'size() === "sm"',
    '[class.sui-drawer--md]': 'size() === "md"',
    '[class.sui-drawer--lg]': 'size() === "lg"',
    '[class.sui-drawer--persistent]': 'persistent()',
    '[class.sm:drawer-open]': 'persistentAt() === "sm"',
    '[class.md:drawer-open]': 'persistentAt() === "md"',
    '[class.lg:drawer-open]': 'persistentAt() === "lg"',
    '[class.xl:drawer-open]': 'persistentAt() === "xl"',
    '(document:keydown.escape)': 'handleCancel($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  /** Controls and reports whether the Drawer is open. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);

  /** Accessible label used when no visible element labels the Drawer. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>('Drawer');
  /** ID of a visible element that labels the Drawer. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that describe the Drawer. */
  public readonly ariaDescribedby: InputSignal<string | null> = input<string | null>(null);
  /** Allows Escape and backdrop clicks to close the Drawer. */
  public readonly dismissible: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Edge from which the Drawer enters. */
  public readonly placement: InputSignal<DrawerPlacement> = input<DrawerPlacement>('start');
  /** Controls the Drawer panel width. */
  public readonly size: InputSignal<DrawerSize> = input<DrawerSize>('md');
  /** Makes the panel persistent at and above a viewport breakpoint. */
  public readonly persistentAt: InputSignal<DrawerPersistentAt | null> = input<DrawerPersistentAt | null>(null);

  /** Emits when the Drawer requests to close. */
  public readonly closed: OutputEmitterRef<DrawerCloseReason> = output<DrawerCloseReason>();

  /** Stable ID referenced by Drawer triggers. */
  public readonly drawerId: string = `sui-drawer-${++nextDrawerId}`;

  protected readonly header: Signal<DrawerHeader | undefined> = contentChild(DrawerHeader);
  protected readonly footer: Signal<DrawerFooter | undefined> = contentChild(DrawerFooter);

  protected readonly toggleId: string = `${this.drawerId}-toggle`;

  protected readonly persistent: Signal<boolean> = computed((): boolean => {
    const breakpoint: DrawerPersistentAt | null = this.persistentAt();
    return breakpoint !== null && this.viewport().breakpoints[DRAWER_BREAKPOINTS[breakpoint]];
  });
  protected readonly modalOpen: Signal<boolean> = computed((): boolean => this.open() && !this.persistent());

  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private readonly document: Document = inject(DOCUMENT);
  private readonly viewport: Signal<BreakpointState> = toSignal(
    this.breakpointObserver.observe(Object.values(DRAWER_BREAKPOINTS)),
    { initialValue: { breakpoints: {}, matches: false } },
  );
  private restoreTarget: HTMLElement | null = null;
  private wasModalOpen: boolean = false;

  public constructor() {
    afterRenderEffect({ write: (): void => this.syncModalState() });
  }

  /** Opens the Drawer and remembers where focus should return. */
  public show(restoreTarget?: HTMLElement): void {
    if (this.isOpen()) return;
    this.restoreTarget = restoreTarget ?? this.activeElement();
    this.open.set(true);
  }

  /** Closes the Drawer and reports why it was dismissed. */
  public close(reason: DrawerCloseReason = 'programmatic'): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit(reason);
  }

  /** Toggles the Drawer from an optional focus restoration target. */
  public toggle(restoreTarget?: HTMLElement): void {
    if (this.open()) this.close();
    else this.show(restoreTarget);
  }

  /** Returns whether the Drawer is currently open. */
  public isOpen(): boolean {
    return this.open() || this.persistent();
  }

  protected handleCancel(event: Event): void {
    if (!this.modalOpen()) return;
    event.preventDefault();
    if (this.dismissible()) this.close('escape');
  }

  protected handleBackdrop(event: MouseEvent): void {
    event.preventDefault();
    if (!this.dismissible()) return;
    this.close('backdrop');
  }

  protected handleSideTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget || event.propertyName !== 'visibility' || !this.modalOpen()) return;
    const panel: HTMLElement | null = this.document.getElementById(this.drawerId);
    if (!panel?.contains(this.document.activeElement)) this.focusPanel();
  }

  private syncModalState(): void {
    const open: boolean = this.modalOpen();
    if (open === this.wasModalOpen) return;

    this.wasModalOpen = open;
    if (open) {
      this.restoreTarget ??= this.activeElement();
      this.document.defaultView?.requestAnimationFrame((): void => {
        if (this.modalOpen()) this.focusPanel();
      });
      return;
    }

    if (this.persistent()) {
      this.restoreTarget = null;
      return;
    }
    this.restoreFocus();
  }

  private activeElement(): HTMLElement | null {
    const activeElement: Element | null = this.document.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
  }

  private focusPanel(): void {
    const panel: HTMLElement | null = this.document.getElementById(this.drawerId);
    const initialTarget: HTMLElement | null =
      panel?.querySelector<HTMLElement>(
        '[autofocus], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ) ?? panel;
    initialTarget?.focus({ preventScroll: true });
  }

  private restoreFocus(): void {
    const restoreTarget: HTMLElement | null = this.restoreTarget;
    this.restoreTarget = null;
    restoreTarget?.focus({ preventScroll: true });
  }
}
