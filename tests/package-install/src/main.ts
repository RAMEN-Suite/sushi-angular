import { Component, signal, WritableSignal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Button, Chip, ToggleButton } from '@sushi-kit/angular';

@Component({
  selector: 'app-root',
  imports: [Button, Chip, ToggleButton],
  template: `
    <button suiButton severity="primary" type="button">Save</button>
    <sui-chip label="Extra small" size="xs" />
    <sui-chip label="Large" size="lg" />
    <sui-toggle-button ariaLabel="Pin item" [(checked)]="pinned" />
    <p>{{ pinned() ? 'Pinned' : 'Not pinned' }}</p>
  `,
})
class App {
  protected readonly pinned: WritableSignal<boolean> = signal(false);
}

bootstrapApplication(App).catch((error: unknown): void => {
  console.error(error);
});
