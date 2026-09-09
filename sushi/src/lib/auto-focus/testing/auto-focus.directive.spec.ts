import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { AutoFocus } from '../auto-focus.directive';

@Component({
  imports: [AutoFocus],
  template: `<button type="button" suiAutoFocus>Ready</button>`,
})
class FocusHost {}

@Component({
  imports: [AutoFocus],
  template: `<button type="button" disabled suiAutoFocus>Unavailable</button>`,
})
class DisabledFocusHost {}

@Component({
  imports: [AutoFocus],
  template: `<button type="button" [suiAutoFocus]="false">Skipped</button>`,
})
class SuppressedFocusHost {}

describe('AutoFocus', (): void => {
  it('focuses an enabled host after its first render', async (): Promise<void> => {
    const fixture: ComponentFixture<FocusHost> = render(FocusHost);
    await fixture.whenStable();
    expect(document.activeElement).toBe(query(fixture, 'button'));
  });

  it('does not focus a disabled host', async (): Promise<void> => {
    const fixture: ComponentFixture<DisabledFocusHost> = render(DisabledFocusHost);
    await fixture.whenStable();
    expect(document.activeElement).not.toBe(query(fixture, 'button'));
  });

  it('does not focus when the request is suppressed', async (): Promise<void> => {
    const fixture: ComponentFixture<SuppressedFocusHost> = render(SuppressedFocusHost);
    await fixture.whenStable();
    expect(document.activeElement).not.toBe(query(fixture, 'button'));
  });
});
