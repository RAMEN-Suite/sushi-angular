import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { MessageActions } from '../message-actions.directive';
import { Message } from '../message.directive';

@Component({
  imports: [Message, MessageActions],
  template: `
    <section suiMessage severity="warning" variant="outlined" orientation="vertical">
      <p>Review changes</p>
      <div suiMessageActions><button type="button">Review</button></div>
    </section>
  `,
})
class MessageHost {}

describe('Message', (): void => {
  it('lays out semantic feedback and its action region', (): void => {
    const fixture: ComponentFixture<MessageHost> = render(MessageHost);
    const message: Element = query(fixture, '[suiMessage]');
    expect(message.classList).toContain('alert-warning');
    expect(message.classList).toContain('alert-outline');
    expect(message.classList).toContain('alert-vertical');
    expect(query(fixture, '[suiMessageActions]').classList).toContain('sui-message-actions');
    expect(message.hasAttribute('role')).toBe(false);
  });
});
