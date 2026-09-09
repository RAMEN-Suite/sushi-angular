import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { DialogClose } from '../dialog-close.directive';
import { DialogHeader } from '../dialog-header.directive';
import { DialogBody, DialogFooter } from '../dialog-slots.directive';
import { DialogTrigger } from '../dialog-trigger.directive';
import { Dialog } from '../dialog.component';
import { DialogCloseEvent } from '../dialog.interfaces';

@Component({
  imports: [Dialog, DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTrigger],
  template: `
    <button data-trigger [suiDialogTrigger]="dialog" [disabled]="triggerDisabled()">Open dialog</button>
    <sui-dialog
      #dialog="suiDialog"
      ariaLabelledby="dialog-title"
      [closeOnEscape]="dismissible()"
      [closeOnBackdrop]="dismissible()"
      [modal]="modal()"
      [position]="position()"
      [draggable]="draggable()"
      [constrainToViewport]="constrainToViewport()"
      [resizable]="resizable()"
      [(open)]="open"
      (closed)="closed.push($event)"
    >
      <header suiDialogHeader><h2 id="dialog-title">Delete project?</h2></header>
      <div suiDialogBody>Dialog content</div>
      <div suiDialogFooter>
        <button data-cancel [suiDialogClose]="dialog">Cancel</button>
        <button data-confirm [suiDialogClose]="dialog" suiDialogCloseValue="confirmed">Delete</button>
      </div>
    </sui-dialog>
  `,
})
class DialogHost {
  public readonly open: WritableSignal<boolean> = signal<boolean>(false);
  public readonly dismissible: WritableSignal<boolean> = signal<boolean>(true);
  public readonly triggerDisabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly modal: WritableSignal<boolean> = signal<boolean>(true);
  public readonly draggable: WritableSignal<boolean> = signal<boolean>(false);
  public readonly constrainToViewport: WritableSignal<boolean> = signal<boolean>(true);
  public readonly resizable: WritableSignal<boolean> = signal<boolean>(false);
  public readonly position: WritableSignal<'bottom-right' | 'center'> = signal<'bottom-right' | 'center'>('center');
  public readonly closed: DialogCloseEvent[] = [];
}

beforeEach((): void => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement): void {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'show', {
    configurable: true,
    value(this: HTMLDialogElement): void {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement, returnValue: string = ''): void {
      this.returnValue = returnValue;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    },
  });
});

afterEach((): void => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'show');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

describe('Dialog state', (): void => {
  it('opens from a trigger and exposes native dialog semantics', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const trigger: HTMLButtonElement = query(fixture, '[data-trigger]') as HTMLButtonElement;
    const dialog: HTMLDialogElement = query(fixture, 'dialog');

    expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    fixture.detectChanges();

    expect(dialog.open).toBe(true);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes with an action value and updates two-way state', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    (query(fixture, '[data-trigger]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (query(fixture, '[data-confirm]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.closed).toEqual([{ reason: 'close', returnValue: 'confirmed' }]);
  });
});

describe('Dialog dismissal', (): void => {
  it('reports backdrop dismissal', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialog: HTMLDialogElement = query(fixture, 'dialog');
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      bottom: 300,
      height: 200,
      left: 100,
      right: 400,
      top: 100,
      width: 300,
      x: 100,
      y: 100,
      toJSON: (): object => ({}),
    });

    dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 50 }));
    fixture.detectChanges();

    expect(fixture.componentInstance.closed).toEqual([{ reason: 'backdrop', returnValue: '' }]);
  });
});

describe('Dialog pointer boundaries', (): void => {
  it('does not treat the Dialog surface as its backdrop', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialog: HTMLDialogElement = query(fixture, 'dialog');
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      bottom: 300,
      height: 200,
      left: 100,
      right: 400,
      top: 100,
      width: 300,
      x: 100,
      y: 100,
      toJSON: (): object => ({}),
    });

    dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 200 }));
    expect(dialog.open).toBe(true);
    expect(fixture.componentInstance.closed).toEqual([]);
  });
});

describe('Dialog required interaction', (): void => {
  it('prevents cancellation when dismissal is disabled', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialog: HTMLDialogElement = query(fixture, 'dialog');
    fixture.componentInstance.dismissible.set(false);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const event: Event = new Event('cancel', { cancelable: true });

    dialog.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);
  });
});

describe('Dialog layout capabilities', (): void => {
  it('enables header dragging only when requested', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialogDebugElement: DebugElement = fixture.debugElement.query(By.directive(CdkDrag));
    const drag: CdkDrag = dialogDebugElement.injector.get(CdkDrag);

    expect(drag.disabled).toBe(true);
    fixture.componentInstance.draggable.set(true);
    fixture.detectChanges();
    expect(drag.disabled).toBe(false);
  });

  it('supports non-modal opening and opt-in layout capabilities', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialog: HTMLDialogElement = query(fixture, 'dialog');
    fixture.componentInstance.modal.set(false);
    fixture.componentInstance.position.set('bottom-right');
    fixture.componentInstance.draggable.set(true);
    fixture.componentInstance.resizable.set(true);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    expect(dialog.open).toBe(true);
    expect(dialog.dataset['position']).toBe('bottom-right');
    expect(dialog.classList).toContain('sui-dialog--resizable');
  });

  it('constrains dragging to the viewport by default and supports opting out', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const dialogDebugElement: DebugElement = fixture.debugElement.query(By.directive(CdkDrag));
    const drag: CdkDrag = dialogDebugElement.injector.get(CdkDrag);

    expect(drag.boundaryElement).toBe(document.documentElement);
    fixture.componentInstance.constrainToViewport.set(false);
    fixture.detectChanges();
    expect(drag.boundaryElement).toBe('');
  });
});

describe('Dialog header', (): void => {
  it('provides a default close action', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const dialog: HTMLDialogElement = query(fixture, 'dialog');

    (query(fixture, '[aria-label="Close"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
  });
});

describe('Dialog trigger', (): void => {
  it('keeps a disabled trigger focusable without opening', (): void => {
    const fixture: ComponentFixture<DialogHost> = render(DialogHost);
    const trigger: HTMLButtonElement = query(fixture, '[data-trigger]') as HTMLButtonElement;
    fixture.componentInstance.triggerDisabled.set(true);
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();

    expect(trigger.disabled).toBe(false);
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
