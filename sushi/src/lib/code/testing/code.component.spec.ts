import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { CodeLine } from '../code-line.directive';
import { Code } from '../code.component';
import { CodeButtonOffTemplate, CodeButtonOnTemplate, CodeButtonTemplate } from '../code.templates';

type Copy = (text: string) => boolean;

const copy: Mock<Copy> = vi.fn<Copy>();

@Component({
  imports: [Code, CodeButtonOffTemplate, CodeButtonOnTemplate, CodeLine],
  template: `
    <sui-code [cooldown]="25">
      <ng-template suiCodeButtonOff><span data-copy>Copy</span></ng-template>
      <ng-template suiCodeButtonOn><span data-copied>Copied</span></ng-template>
      <pre suiCodeLine prefix="$">npm run build </pre>
      <pre suiCodeLine [prefix]="2">done</pre>
    </sui-code>
  `,
})
class CodeHost {}

@Component({
  imports: [Code, CodeButtonTemplate, CodeLine],
  template: `
    <sui-code>
      <ng-template suiCodeButton let-run let-copied="copied">
        <button data-custom type="button" (click)="run()">{{ copied() ? 'Done' : 'Run' }}</button>
      </ng-template>
      <code suiCodeLine>alpha</code>
    </sui-code>
  `,
})
class CustomCodeHost {}

@Component({
  imports: [Code],
  template: `<sui-code></sui-code>`,
})
class EmptyCodeHost {}

@Component({
  imports: [Code],
  template: `<sui-code [copyable]="false"></sui-code>`,
})
class StaticCodeHost {}

beforeEach((): void => {
  copy.mockReset();
  copy.mockReturnValue(true);
  TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: { copy } }] });
});

afterEach((): void => {
  vi.useRealTimers();
});

describe('Code', (): void => {
  it('copies trimmed code lines and shows temporary feedback', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<CodeHost> = render(CodeHost);
    expect(query(fixture, '[suiCodeLine]').getAttribute('data-prefix')).toBe('$');
    query(fixture, 'button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(copy).toHaveBeenCalledWith('npm run build\ndone');
    expect(query(fixture, '[data-copied]').textContent).toBe('Copied');
    vi.advanceTimersByTime(25);
    fixture.detectChanges();
    expect(query(fixture, '[data-copy]').textContent).toBe('Copy');
  });

  it('exposes copy behavior and state to a complete button template', (): void => {
    const fixture: ComponentFixture<CustomCodeHost> = render(CustomCodeHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    expect(button.textContent).toBe('Run');
    button.click();
    fixture.detectChanges();
    expect(copy).toHaveBeenCalledWith('alpha');
    expect(button.textContent).toBe('Done');
  });

  it('does not report copied state when the clipboard rejects the text', (): void => {
    copy.mockReturnValue(false);
    const fixture: ComponentFixture<CustomCodeHost> = render(CustomCodeHost);
    query(fixture, 'button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(query(fixture, 'button').textContent).toBe('Run');
  });

  it('does not call the clipboard when no copyable lines exist', (): void => {
    const fixture: ComponentFixture<EmptyCodeHost> = render(EmptyCodeHost);
    query(fixture, 'button').click();
    expect(copy).not.toHaveBeenCalled();
  });

  it('omits the copy control when copying is disabled', (): void => {
    const fixture: ComponentFixture<StaticCodeHost> = render(StaticCodeHost);
    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });
});
