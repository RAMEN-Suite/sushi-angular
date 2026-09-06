import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { JoinItem } from '../join-item.directive';
import { Join } from '../join.directive';

@Component({
  imports: [Join, JoinItem],
  template: `<div suiJoin orientation="vertical"><button suiJoinItem>A</button><button suiJoinItem>B</button></div>`,
})
class JoinHost {}

describe('Join', (): void => {
  it('connects marked children without changing their native behavior', (): void => {
    const fixture: ComponentFixture<JoinHost> = render(JoinHost);
    expect(query(fixture, '[suiJoin]').classList).toContain('join-vertical');
    expect(queryAll(fixture, 'button')).toHaveLength(2);
    expect(queryAll(fixture, '.join-item')).toHaveLength(2);
    expect(query(fixture, 'button').hasAttribute('disabled')).toBe(false);
  });
});
