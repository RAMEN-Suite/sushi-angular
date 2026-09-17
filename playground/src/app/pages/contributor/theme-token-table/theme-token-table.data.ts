export interface ThemeToken {
  readonly defaultValue: string;
  readonly group: string;
  readonly purpose: string;
  readonly token: string;
}

export const THEME_TOKENS: readonly ThemeToken[] = [
  { group: 'Surface', token: '--color-base-100', defaultValue: '#ffffff', purpose: 'Primary application surface' },
  { group: 'Surface', token: '--color-base-200', defaultValue: 'zinc-100', purpose: 'Raised or grouped surface' },
  { group: 'Surface', token: '--color-base-300', defaultValue: 'zinc-200', purpose: 'Borders and stronger surfaces' },
  { group: 'Surface', token: '--color-base-content', defaultValue: 'zinc-950', purpose: 'Content on base surfaces' },
  { group: 'Brand', token: '--color-primary', defaultValue: '#7a0712', purpose: 'Primary actions and selection' },
  { group: 'Brand', token: '--color-primary-content', defaultValue: '#ffffff', purpose: 'Content on primary' },
  { group: 'Brand', token: '--color-secondary', defaultValue: '#17130f', purpose: 'Secondary emphasis' },
  { group: 'Brand', token: '--color-secondary-content', defaultValue: '#ffffff', purpose: 'Content on secondary' },
  { group: 'Brand', token: '--color-accent', defaultValue: '#d39a2f', purpose: 'Accent actions and details' },
  { group: 'Brand', token: '--color-accent-content', defaultValue: '#ffffff', purpose: 'Content on accent' },
  { group: 'Brand', token: '--color-neutral', defaultValue: '#3f3f46', purpose: 'Neutral controls and surfaces' },
  { group: 'Brand', token: '--color-neutral-content', defaultValue: '#ffffff', purpose: 'Content on neutral' },
  { group: 'Feedback', token: '--color-info', defaultValue: '#2f7fa8', purpose: 'Informational feedback' },
  { group: 'Feedback', token: '--color-info-content', defaultValue: '#ffffff', purpose: 'Content on info' },
  { group: 'Feedback', token: '--color-success', defaultValue: '#5f8f62', purpose: 'Successful feedback' },
  { group: 'Feedback', token: '--color-success-content', defaultValue: '#ffffff', purpose: 'Content on success' },
  { group: 'Feedback', token: '--color-warning', defaultValue: '#d39a2f', purpose: 'Warning feedback' },
  { group: 'Feedback', token: '--color-warning-content', defaultValue: '#ffffff', purpose: 'Content on warning' },
  { group: 'Feedback', token: '--color-error', defaultValue: '#7a0712', purpose: 'Error and destructive feedback' },
  { group: 'Feedback', token: '--color-error-content', defaultValue: '#ffffff', purpose: 'Content on error' },
  { group: 'Shape', token: '--radius-selector', defaultValue: '0.375rem', purpose: 'Selection control radius' },
  { group: 'Shape', token: '--radius-field', defaultValue: '0.375rem', purpose: 'Field and action radius' },
  { group: 'Shape', token: '--radius-box', defaultValue: '0.375rem', purpose: 'Container radius' },
  { group: 'Density', token: '--size-selector', defaultValue: '0.25rem', purpose: 'Selection control scale' },
  { group: 'Density', token: '--size-field', defaultValue: '0.25rem', purpose: 'Field and action scale' },
  { group: 'Effects', token: '--border', defaultValue: '1px', purpose: 'Default border width' },
  { group: 'Effects', token: '--depth', defaultValue: '0.5', purpose: 'Surface depth strength' },
  { group: 'Effects', token: '--noise', defaultValue: '0', purpose: 'Surface texture strength' },
];
