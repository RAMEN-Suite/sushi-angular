import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { ContextMenuTrigger } from '../context-menu-trigger.directive';
import { Menu } from '../menu.component';
import type { MenuEntry, MenuItem, MenuValue } from '../menu.interfaces';
import { MenuGroupTemplate, MenuItemTemplate, MenuStartTemplate } from '../menu.templates';
import { MenuTrigger } from '../menu-trigger.directive';

const items: readonly MenuEntry[] = [
  { label: 'Open', value: 'open', active: true },
  { type: 'separator' },
  { type: 'group', label: 'Edit', items: [{ label: 'Duplicate', value: 'duplicate' }] },
  { label: 'Share', value: 'share', items: [{ label: 'Copy link', value: 'copy' }] },
  { label: 'Delete', value: 'delete', disabled: true },
];

@Component({
  imports: [Menu, MenuGroupTemplate, MenuItemTemplate, MenuStartTemplate],
  template: `
    <sui-menu ariaLabel="Document actions" [disabled]="disabled()" [items]="items" (itemSelected)="selected.push($event)">
      <ng-template suiMenuStart><span data-start>Actions</span></ng-template>
      <ng-template [suiMenuGroup]="items" let-group
        ><span [attr.data-group]="group.label">{{ group.label }}</span></ng-template
      >
      <ng-template [suiMenuItem]="items" let-item let-active="active">
        <span [attr.data-item]="item.value" [attr.data-active]="active">{{ item.label }}</span>
      </ng-template>
    </sui-menu>
  `,
})
class InlineMenuHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly items: readonly MenuEntry[] = items;
  public readonly selected: MenuValue[] = [];
}

@Component({
  imports: [ContextMenuTrigger, Menu, MenuTrigger],
  template: `
    <button data-trigger [suiMenuTrigger]="menu">Actions</button>
    <div data-context tabindex="0" [suiContextMenuTrigger]="menu">Document</div>
    <sui-menu #menu popup ariaLabel="Popup actions" [items]="items" (itemSelected)="selected.push($event)" />
  `,
})
class PopupMenuHost {
  public readonly menu: Signal<Menu> = viewChild.required(Menu);
  public readonly items: readonly MenuItem[] = [
    { label: 'Rename', value: 'rename' },
    { label: 'Archive', value: 'archive' },
  ];
  public readonly selected: MenuValue[] = [];
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

function closest(element: Element, selector: string): HTMLElement {
  const match: HTMLElement | null = element.closest<HTMLElement>(selector);
  if (match === null) throw new Error(`Expected element to have a "${selector}" ancestor.`);
  return match;
}

function documentQuery(selector: string): HTMLElement {
  const element: HTMLElement | null = document.querySelector<HTMLElement>(selector);
  if (element === null) throw new Error(`Expected document to contain "${selector}".`);
  return element;
}

describe('Menu inline semantics', (): void => {
  it('renders actions, groups, separators, active state, and templates', (): void => {
    const fixture: ComponentFixture<InlineMenuHost> = render(InlineMenuHost);
    expect(query(fixture, '[role="menu"]').getAttribute('aria-label')).toBe('Document actions');
    expect(queryAll(fixture, '[role="menuitem"]')).toHaveLength(5);
    expect(queryAll(fixture, '[role="separator"]')).toHaveLength(1);
    expect(queryAll(fixture, '[role="group"]')).toHaveLength(1);
    expect(query(fixture, '[data-start]').textContent).toBe('Actions');
    expect(query(fixture, '[data-group="Edit"]').textContent).toBe('Edit');
    expect(query(fixture, '[data-item="open"]').getAttribute('data-active')).toBe('true');
  });

  it('emits enabled actions without activating structural or disabled entries', (): void => {
    const fixture: ComponentFixture<InlineMenuHost> = render(InlineMenuHost);
    const open: HTMLElement = closest(query(fixture, '[data-item="open"]'), '[role="menuitem"]');
    const disabled: HTMLElement = closest(query(fixture, '[data-item="delete"]'), '[role="menuitem"]');
    open.click();
    disabled.click();

    expect(fixture.componentInstance.selected).toEqual(['open']);
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
  });

  it('opens a nested submenu without selecting its disclosure', (): void => {
    const fixture: ComponentFixture<InlineMenuHost> = render(InlineMenuHost);
    const share: HTMLElement = closest(query(fixture, '[data-item="share"]'), '[role="menuitem"]');
    share.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toEqual([]);
    expect(closest(query(fixture, '[data-item="copy"]'), '[role="menu"]').classList.contains('hidden')).toBe(false);
  });

  it('keeps a disabled menu discoverable while blocking all actions', (): void => {
    const fixture: ComponentFixture<InlineMenuHost> = render(InlineMenuHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const open: HTMLElement = closest(query(fixture, '[data-item="open"]'), '[role="menuitem"]');
    open.focus();
    open.click();

    expect(document.activeElement).toBe(open);
    expect(fixture.componentInstance.selected).toEqual([]);
    expect(query(fixture, '[role="menu"]').getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Menu popup triggers', (): void => {
  it('opens from a button, focuses its first action, selects, and restores focus', async (): Promise<void> => {
    const fixture: ComponentFixture<PopupMenuHost> = render(PopupMenuHost);
    const trigger: HTMLButtonElement = query(fixture, 'button');
    trigger.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const action: HTMLElement = documentQuery('[role="menuitem"]');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(action);
    action.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toEqual(['rename']);
    expect(fixture.componentInstance.menu().isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('opens from the keyboard context-menu gesture and closes with Escape', async (): Promise<void> => {
    const fixture: ComponentFixture<PopupMenuHost> = render(PopupMenuHost);
    const context: HTMLElement = query(fixture, '[data-context]') as HTMLElement;
    context.focus();
    press(context, 'F10', { shiftKey: true });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.menu().isOpen()).toBe(true);
    const action: HTMLElement = documentQuery('[role="menuitem"]');
    press(action, 'Escape');
    fixture.detectChanges();
    expect(fixture.componentInstance.menu().isOpen()).toBe(false);
    expect(document.activeElement).toBe(context);
  });
});
