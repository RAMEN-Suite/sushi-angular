import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardSize, CardTitle, CardVariant } from '@sushi-kit/angular';

interface CardPreview {
  readonly size: CardSize;
  readonly title: string;
}

interface VariantPreview {
  readonly description: string;
  readonly title: string;
  readonly variant: CardVariant;
}

@Component({
  selector: 'pg-card-appearance-example',
  imports: [Card, CardTitle],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAppearanceExample {
  protected readonly cards: readonly CardPreview[] = [
    { size: 'xs', title: 'Extra small' },
    { size: 'sm', title: 'Small' },
    { size: 'lg', title: 'Large' },
    { size: 'xl', title: 'Extra large' },
  ];
  protected readonly variants: readonly VariantPreview[] = [
    { title: 'Plain', description: 'A quiet surface without a visible edge.', variant: 'plain' },
    { title: 'Border', description: 'A defined surface for regular content.', variant: 'border' },
    { title: 'Dash', description: 'A dashed boundary for empty or pending content.', variant: 'dash' },
  ];
}
