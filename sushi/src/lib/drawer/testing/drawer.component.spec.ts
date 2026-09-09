import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query } from '../../../../testing/test-utils';
import { render } from '../../../../testing/test-utils';
import { DrawerClose } from '../drawer-close.directive';
import { Drawer } from '../drawer.component';
import { DrawerCloseReason, DrawerPersistentAt, DrawerPlacement, DrawerSize } from '../drawer.interfaces';
import { DrawerFooter, DrawerHeader } from '../drawer-slots.directive';
import { DrawerTrigger } from '../drawer-trigger.directive';

@Component({
  imports: [Drawer, DrawerClose, DrawerFooter, DrawerHeader, DrawerTrigger],
  template: `
    <button data-trigger [suiDrawerTrigger]="drawer" [disabled]="triggerDisabled()">Open panel</button>
    <p id="drawer-description">Edit the current project.</p>
    <sui-drawer
      #drawer="suiDrawer"
      ariaLabel="Project settings"
      ariaDescribedby="drawer-description"
      [dismissible]="dismissible()"
      [placement]="placement()"
      [persistentAt]="persistentAt()"
      [size]="size()"
      [(open)]="open"
      (closed)="closeReasons.push($event)"
    >
      @if (projectHeader()) {
        <div suiDrawerHeader data-header>Project settings</div>
      }
      <div data-body><button data-close [suiDrawerClose]="drawer">Close panel</button></div>
      @if (projectFooter()) {
        <div suiDrawerFooter data-footer>Footer actions</div>
      }
    </sui-drawer>
  `,
})
class DrawerHost {
  public readonly open: WritableSignal<boolean> = signal(false);
  public readonly dismissible: WritableSignal<boolean> = signal(true);
  public readonly placement: WritableSignal<DrawerPlacement> = signal('start');
  public readonly size: WritableSignal<DrawerSize> = signal('md');
  public readonly persistentAt: WritableSignal<DrawerPersistentAt | null> = signal(null);
  public readonly triggerDisabled: WritableSignal<boolean> = signal(false);
  public readonly projectHeader: WritableSignal<boolean> = signal(true);
  public readonly projectFooter: WritableSignal<boolean> = signal(true);
  public readonly closeReasons: DrawerCloseReason[] = [];
}

describe('Drawer', (): void => {
  it('renders a labeled modal dialog with optional header and footer regions', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    const drawer: Element = query(fixture, 'sui-drawer');
    const panel: Element = query(fixture, '.sui-drawer__panel');

    expect(drawer.classList).not.toContain('drawer-end');
    expect(drawer.classList).toContain('sui-drawer--md');
    expect(panel.getAttribute('aria-label')).toBe('Project settings');
    expect(panel.getAttribute('aria-describedby')).toBe('drawer-description');
    expect(query(fixture, '.sui-drawer__header-region').textContent).toContain('Project settings');
    expect(query(fixture, '.sui-drawer__body [data-body]').textContent).toContain('Close panel');
    expect(query(fixture, '.sui-drawer__footer-region').textContent).toContain('Footer actions');
  });

  it('opens from a trigger and exposes the controlled state', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    const trigger: HTMLButtonElement = query(fixture, '[data-trigger]') as HTMLButtonElement;
    const panel: HTMLElement = query(fixture, '.sui-drawer__panel') as HTMLElement;
    const toggle: HTMLInputElement = query(fixture, 'input');

    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.checked).toBe(true);
    expect(panel.getAttribute('role')).toBe('dialog');
  });

  it('closes through the close directive and emits the reason', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    (query(fixture, '[data-trigger]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (query(fixture, '[data-close]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.closeReasons).toEqual(['programmatic']);
  });
});

describe('Drawer focus', (): void => {
  it('restores focus to the trigger after closing', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    const trigger: HTMLButtonElement = query(fixture, '[data-trigger]') as HTMLButtonElement;
    const close: HTMLButtonElement = query(fixture, '[data-close]') as HTMLButtonElement;

    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    close.focus();
    close.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
  });
});

describe('Drawer dismissal', (): void => {
  it('supports Escape and backdrop dismissal', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    const panel: HTMLElement = query(fixture, '.sui-drawer__panel') as HTMLElement;
    const overlay: HTMLButtonElement = query(fixture, '.drawer-overlay') as HTMLButtonElement;

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    panel.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    overlay.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.closeReasons).toEqual(['escape', 'backdrop']);
  });

  it('keeps a non-dismissible Drawer open on Escape and backdrop clicks', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    const panel: HTMLElement = query(fixture, '.sui-drawer__panel') as HTMLElement;
    const overlay: HTMLButtonElement = query(fixture, '.drawer-overlay') as HTMLButtonElement;
    fixture.componentInstance.dismissible.set(false);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    panel.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
    overlay.click();
    fixture.detectChanges();

    expect(overlay.disabled).toBe(true);
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.componentInstance.open()).toBe(true);
    expect(fixture.componentInstance.closeReasons).toEqual([]);
  });
});

describe('Drawer variants', (): void => {
  it('reflects placement and size variants', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    fixture.componentInstance.placement.set('end');
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    const drawer: Element = query(fixture, 'sui-drawer');
    expect(drawer.classList).toContain('drawer-end');
    expect(drawer.classList).toContain('sui-drawer--lg');
  });

  it('applies the DaisyUI responsive open variant at the selected breakpoint', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    fixture.componentInstance.persistentAt.set('lg');
    fixture.detectChanges();

    expect(query(fixture, 'sui-drawer').classList).toContain('lg:drawer-open');
  });

  it('keeps disabled triggers focusable without opening the Drawer', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    fixture.componentInstance.triggerDisabled.set(true);
    fixture.detectChanges();
    const trigger: HTMLButtonElement = query(fixture, '[data-trigger]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(trigger.disabled).toBe(false);
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('omits unused projected regions', (): void => {
    const fixture: ComponentFixture<DrawerHost> = render(DrawerHost);
    fixture.componentInstance.projectHeader.set(false);
    fixture.componentInstance.projectFooter.set(false);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.sui-drawer__header-region')).toBeNull();
    expect(host.querySelector('.sui-drawer__footer-region')).toBeNull();
  });
});
