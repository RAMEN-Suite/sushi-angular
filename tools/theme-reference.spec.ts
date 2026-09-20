import { describe, expect, it } from 'vitest';
import { readThemeTokenReferences } from './theme-reference';

describe('theme token reference', (): void => {
  it('collects documented tokens and matches their dark values', (): void => {
    const source: string = `
      @plugin "daisyui/theme" {
        name: 'sushi';
        /** @group Brand | Primary action color. */
        --color-primary: #7a0712;
      }
      @plugin "daisyui/theme" {
        name: 'sushi-dark';
        --color-primary: #e35a60;
      }
    `;

    expect(readThemeTokenReferences(source)).toEqual([
      {
        token: '--color-primary',
        lightValue: '#7a0712',
        darkValue: '#e35a60',
        group: 'Brand',
        purpose: 'Primary action color.',
      },
    ]);
  });

  it('rejects undocumented theme tokens', (): void => {
    const source: string = `
      @plugin "daisyui/theme" {
        name: 'sushi';
        --color-primary: #7a0712;
      }
      @plugin "daisyui/theme" {
        name: 'sushi-dark';
        --color-primary: #e35a60;
      }
    `;

    expect((): readonly unknown[] => readThemeTokenReferences(source)).toThrow(
      'Theme token "--color-primary" is missing documentation.',
    );
  });
});
