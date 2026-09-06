import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Status } from '../status.directive';

@Component({ imports: [Status], template: `<span suiStatus severity="success" size="sm" animation="ping"></span>` })
class StatusHost {}

describe('Status', (): void => {
  it('applies state color, marker size, and motion without inventing a label', (): void => {
    const fixture: ComponentFixture<StatusHost> = render(StatusHost);
    const status: HTMLSpanElement = query(fixture, 'span');
    expect(status.classList).toContain('status-success');
    expect(status.classList).toContain('status-sm');
    expect(status.classList).toContain('sui-status--ping');
    expect(status.hasAttribute('aria-label')).toBe(false);
  });
});
