import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideGlobe } from '@lucide/angular';
import {
  Badge,
  Label,
  Select,
  SelectCompareWith,
  SelectGroupTemplate,
  SelectItemTemplate,
  SelectModelValue,
  SelectOption,
  SelectSelectedItemTemplate,
  SelectValue,
} from '@sushi-kit/angular';

interface Country extends SelectOption {
  readonly code: string;
  readonly flag: string;
  readonly region: string;
}

@Component({
  selector: 'pg-select-options-example',
  imports: [Badge, Label, Select, SelectGroupTemplate, SelectItemTemplate, SelectSelectedItemTemplate, LucideGlobe],
  templateUrl: './options.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionsExample {
  protected readonly countries: readonly Country[] = [
    { label: 'Germany', value: { code: 'DE' }, code: 'DE', flag: '🇩🇪', region: 'Europe', group: 'Europe' },
    { label: 'Portugal', value: { code: 'PT' }, code: 'PT', flag: '🇵🇹', region: 'Europe', group: 'Europe' },
    { label: 'Sweden', value: { code: 'SE' }, code: 'SE', flag: '🇸🇪', region: 'Europe', group: 'Europe' },
    { label: 'Japan', value: { code: 'JP' }, code: 'JP', flag: '🇯🇵', region: 'Asia Pacific', group: 'Asia Pacific' },
    { label: 'Singapore', value: { code: 'SG' }, code: 'SG', flag: '🇸🇬', region: 'Asia Pacific', group: 'Asia Pacific' },
    { label: 'New Zealand', value: { code: 'NZ' }, code: 'NZ', flag: '🇳🇿', region: 'Asia Pacific', group: 'Asia Pacific' },
    { label: 'Canada', value: { code: 'CA' }, code: 'CA', flag: '🇨🇦', region: 'Americas', group: 'Americas' },
    { label: 'Brazil', value: { code: 'BR' }, code: 'BR', flag: '🇧🇷', region: 'Americas', group: 'Americas' },
    { label: 'Mexico', value: { code: 'MX' }, code: 'MX', flag: '🇲🇽', region: 'Americas', group: 'Americas' },
  ];
  protected readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>({ code: 'CA' });
  protected readonly compareCountries: SelectCompareWith = (first: SelectValue, second: SelectValue): boolean =>
    typeof first === 'object' && typeof second === 'object' && 'code' in first && 'code' in second && first.code === second.code;

  protected asCountry(value: SelectOption): Country {
    return value as Country;
  }

  protected groupSize(group: string): number {
    return this.countries.filter((country: Country): boolean => country.group === group).length;
  }
}
