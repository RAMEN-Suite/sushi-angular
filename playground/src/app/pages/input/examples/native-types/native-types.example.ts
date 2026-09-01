import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, Input, Label } from '@ramen-suite/sushi';

interface NativeType {
  label: string;
  type: string;
  placeholder: string;
}

@Component({
  selector: 'pg-input-native-types-example',
  imports: [Badge, Card, Input, Label],
  templateUrl: './native-types.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNativeTypesExample {
  protected readonly types: readonly NativeType[] = [
    { label: 'Text', type: 'text', placeholder: 'Plain text' },
    { label: 'Password', type: 'password', placeholder: 'Secret value' },
    { label: 'Email', type: 'email', placeholder: 'name@example.com' },
    { label: 'Number', type: 'number', placeholder: '42' },
    { label: 'Telephone', type: 'tel', placeholder: '+49 123 456' },
    { label: 'URL', type: 'url', placeholder: 'https://example.com' },
    { label: 'Search', type: 'search', placeholder: 'Search terms' },
    { label: 'Date', type: 'date', placeholder: '' },
    { label: 'Time', type: 'time', placeholder: '' },
    { label: 'Date and time', type: 'datetime-local', placeholder: '' },
    { label: 'Month', type: 'month', placeholder: '' },
    { label: 'Week', type: 'week', placeholder: '' },
  ];
}
