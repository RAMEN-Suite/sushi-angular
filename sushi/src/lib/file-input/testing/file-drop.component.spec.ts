import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { FileDrop } from '../file-drop.component';
import type { FileDropRejection } from '../file-drop.interfaces';
import { FileDropContentTemplate, FileDropItemTemplate } from '../file-drop.templates';

const image: File = new File(['image'], 'ramen.png', { type: 'image/png' });
const documentFile: File = new File(['document'], 'menu.pdf', { type: 'application/pdf' });
const textFile: File = new File(['notes'], 'notes.txt', { type: 'text/plain' });

function assignFiles(input: HTMLInputElement, files: readonly File[]): void {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
}

function drop(zone: Element, files: readonly File[]): Event {
  const event: Event = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    value: { files, dropEffect: 'none' },
  });
  zone.dispatchEvent(event);
  return event;
}

@Component({
  imports: [FileDrop, FileDropContentTemplate, FileDropItemTemplate],
  template: `
    <sui-file-drop
      accept="image/*,.pdf"
      multiple
      [disabled]="disabled()"
      [(value)]="value"
      (filesDropped)="drops.push($event)"
      (filesRejected)="rejections.push($event)"
      (touch)="touches += 1"
    >
      <ng-template suiFileDropContent let-files let-active="active" let-disabled="disabled">
        <span data-content [attr.data-count]="files.length" [attr.data-active]="active" [attr.data-disabled]="disabled">
          Upload assets
        </span>
      </ng-template>
      <ng-template suiFileDropItem let-file let-index="index" let-size="size">
        <span [attr.data-file]="file.name" [attr.data-index]="index" [attr.data-size]="size">{{ file.name }}</span>
      </ng-template>
    </sui-file-drop>
  `,
})
class FileDropHost {
  public readonly control: Signal<FileDrop> = viewChild.required(FileDrop);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<readonly File[]> = signal<readonly File[]>([]);
  public readonly drops: (readonly File[])[] = [];
  public readonly rejections: (readonly FileDropRejection[])[] = [];
  public touches: number = 0;
}

describe('FileDrop native selection', (): void => {
  it('accepts matching files, rejects others, and exposes item context', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const input: HTMLInputElement = query(fixture, 'input');
    assignFiles(input, [image, textFile, documentFile]);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual([image, documentFile]);
    expect(fixture.componentInstance.rejections).toHaveLength(1);
    expect(fixture.componentInstance.rejections[0][0].file).toBe(textFile);
    expect(query(fixture, '[data-file="ramen.png"]').getAttribute('data-index')).toBe('0');
    expect(query(fixture, '[data-file="menu.pdf"]').getAttribute('data-size')).toBe('8 B');
  });

  it('removes one file, restores focus, and clears all files', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const choose: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.value.set([image, documentFile]);
    fixture.detectChanges();

    query(fixture, '[aria-label="Remove ramen.png"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([documentFile]);
    expect(document.activeElement).toBe(choose);

    const clear: HTMLButtonElement = queryAll(fixture, 'button')[1];
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
    expect(fixture.componentInstance.touches).toBe(2);
  });
});

describe('FileDrop drag and drop', (): void => {
  it('accepts a drop, emits its files, and reports rejected files', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const zone: Element = query(fixture, '.sui-file-drop__zone');
    const event: Event = drop(zone, [image, textFile]);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.value()).toEqual([image]);
    expect(fixture.componentInstance.drops).toEqual([[image]]);
    expect(fixture.componentInstance.rejections).toHaveLength(1);
    expect(fixture.componentInstance.touches).toBe(1);
  });

  it('exposes active drag state through the content template', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const zone: Element = query(fixture, '.sui-file-drop__zone');
    const drag: Event = new Event('dragenter', { bubbles: true, cancelable: true });
    Object.defineProperty(drag, 'dataTransfer', { value: { dropEffect: 'none' } });
    zone.dispatchEvent(drag);
    fixture.detectChanges();

    expect(query(fixture, '[data-content]').getAttribute('data-active')).toBe('true');

    zone.dispatchEvent(new Event('dragleave', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(query(fixture, '[data-content]').getAttribute('data-active')).toBe('false');
  });
});

describe('FileDrop disabled and public behavior', (): void => {
  it('focuses its picker action and resets selected state', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const choose: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.value.set([image]);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    expect(document.activeElement).toBe(choose);
    fixture.componentInstance.control().reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('keeps its action focusable while disabled and blocks drops and removal', (): void => {
    const fixture: ComponentFixture<FileDropHost> = render(FileDropHost);
    const choose: HTMLButtonElement = query(fixture, 'button');
    const zone: Element = query(fixture, '.sui-file-drop__zone');
    fixture.componentInstance.value.set([image]);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    drop(zone, [documentFile]);
    query(fixture, '[aria-label="Remove ramen.png"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.activeElement).toBe(choose);
    expect(choose.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.value()).toEqual([image]);
    expect(fixture.componentInstance.drops).toEqual([]);
  });
});
