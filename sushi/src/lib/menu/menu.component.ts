import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { CdkConnectedOverlay, ConnectedPosition, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  numberAttribute,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MenuEntry, MenuGroupContext, MenuItem, MenuItemContext, MenuPlacement, MenuSeverity, MenuSize } from './menu.interfaces';
import { MenuSurface } from './internal/menu-surface.component';
import { MenuEndTemplate, MenuGroupTemplate, MenuItemTemplate, MenuStartTemplate } from './menu.templates';

let nextMenuId: number = 0;

const MENU_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

const MENU_RIGHT_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
];

/** Presents related commands inline or in a trigger-controlled popup. */
@Component({
  selector: 'sui-menu',
  imports: [CdkConnectedOverlay, MenuSurface, NgTemplateOutlet],
  templateUrl: './menu.component.html',
  host: {
    class: 'sui-menu block max-w-full',
    '[class.w-full]': 'fluid()',
    '[class.w-fit]': '!fluid()',
    '[class.cursor-not-allowed]': 'disabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu<I extends MenuItem = MenuItem> {
  /** Actions, groups, and separators rendered by the menu. */
  public readonly items: InputSignal<readonly MenuEntry<I>[]> = input.required<readonly MenuEntry<I>[]>();

  /** Accessible label used when no visible label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the menu. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);

  /** Prevents every action and removes its entries from keyboard navigation. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Makes the menu surface fill the host width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Theme color used for pressed and active actions. */
  public readonly severity: InputSignal<MenuSeverity> = input<MenuSeverity>('primary');
  /** Controls menu item dimensions and text size. */
  public readonly size: InputSignal<MenuSize> = input<MenuSize>('md');
  /** Renders the menu in an overlay controlled by a Menu Trigger. */
  public readonly popup: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Preferred side of a popup Menu relative to its trigger. */
  public readonly placement: InputSignal<MenuPlacement> = input<MenuPlacement>('bottom');
  /** Wraps arrow navigation between the first and last action. */
  public readonly wrap: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Delay in milliseconds before the typeahead buffer is cleared. */
  public readonly typeaheadDelay: InputSignalWithTransform<number, unknown> = input(500, { transform: numberAttribute });

  /** Emits the value of an activated menu action. */
  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  protected readonly startTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MenuStartTemplate, {
    read: TemplateRef,
  });
  protected readonly endTemplate: Signal<TemplateRef<void> | undefined> = contentChild(MenuEndTemplate, {
    read: TemplateRef,
  });
  protected readonly itemTemplate: Signal<TemplateRef<MenuItemContext<I>> | undefined> = contentChild(MenuItemTemplate, {
    read: TemplateRef,
  });
  protected readonly groupTemplate: Signal<TemplateRef<MenuGroupContext<I>> | undefined> = contentChild(MenuGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly surface: Signal<MenuSurface<I> | undefined> = viewChild(MenuSurface<I>);

  /** ID used by trigger directives to reference the popup surface. */
  public readonly surfaceId: string = `sui-menu-${++nextMenuId}`;

  protected readonly expanded: WritableSignal<boolean> = signal(false);
  protected readonly origin: WritableSignal<FlexibleConnectedPositionStrategyOrigin | undefined> = signal(undefined);
  protected readonly positions: Signal<ConnectedPosition[]> = computed(() =>
    this.placement() === 'right' ? MENU_RIGHT_POSITIONS : MENU_POSITIONS,
  );

  private readonly focusPending: WritableSignal<boolean> = signal(false);
  private restoreTarget: HTMLElement | undefined;
  private anchor: HTMLElement | undefined;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly document: Document = inject(DOCUMENT);

  public constructor() {
    this.destroyRef.onDestroy((): void => this.removeAnchor());

    afterRenderEffect({
      write: (): void => {
        if (!this.focusPending() || !this.surface()) return;
        this.focusPending.set(false);
        this.focus();
      },
    });
  }

  /** Opens the menu beside a trigger and moves focus to its first enabled action. */
  public open(origin: HTMLElement): void {
    if (this.disabled() || !this.popup()) return;
    this.removeAnchor();
    this.show(origin, origin);
  }

  /** Opens a popup menu at a viewport point anchored to its document position. */
  public openAt(point: { readonly x: number; readonly y: number }, restoreTarget: HTMLElement): void {
    if (this.disabled() || !this.popup()) return;
    this.show(this.createAnchor(point), restoreTarget);
  }

  /** Closes a popup menu and restores focus to its trigger. */
  public close(restoreFocus: boolean = true): void {
    if (!this.expanded()) return;
    const restoreTarget: HTMLElement | undefined = this.restoreTarget;

    this.expanded.set(false);
    this.restoreTarget = undefined;
    this.removeAnchor();
    if (restoreFocus) restoreTarget?.focus({ preventScroll: true });
  }

  /** Toggles the popup menu beside a trigger. */
  public toggle(origin: HTMLElement): void {
    if (this.expanded()) this.close();
    else this.open(origin);
  }

  /** Moves focus to the first enabled menu action. */
  public focus(): void {
    this.surface()?.focus();
  }

  /** Returns whether the popup menu is currently open. */
  public isOpen(): boolean {
    return this.expanded();
  }

  protected handleSelection(value: I['value']): void {
    if (this.disabled()) return;
    this.itemSelected.emit(value);
    if (this.popup()) this.close();
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.close();
  }

  private show(origin: FlexibleConnectedPositionStrategyOrigin, restoreTarget: HTMLElement): void {
    this.origin.set(origin);
    this.restoreTarget = restoreTarget;
    this.focusPending.set(true);
    this.expanded.set(true);
  }

  private createAnchor(point: { readonly x: number; readonly y: number }): HTMLElement {
    this.removeAnchor();

    const scrollX: number = this.document.defaultView?.scrollX ?? 0;
    const scrollY: number = this.document.defaultView?.scrollY ?? 0;
    const anchor: HTMLElement = this.document.createElement('span');
    Object.assign(anchor.style, {
      position: 'absolute',
      pointerEvents: 'none',
      visibility: 'hidden',
      left: `${point.x + scrollX}px`,
      top: `${point.y + scrollY}px`,
      width: '0',
      height: '0',
    });
    this.document.body.append(anchor);
    this.anchor = anchor;
    return anchor;
  }

  private removeAnchor(): void {
    this.anchor?.remove();
    this.anchor = undefined;
  }
}
