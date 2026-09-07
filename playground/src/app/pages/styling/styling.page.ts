import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Badge, Card, CardTitle, Code, CodeLine, Table, TableCellTemplate, TableColumn } from '@ramen-suite/sushi';
import { apiReferences } from '../../shared/api-reference/api-reference.registry';
import type { ApiMember, ApiReferenceData, ApiStyleProperty, ApiTemplate } from '../../shared/api-reference/api-reference.types';

interface StyleReference extends ApiReferenceData {
  readonly styles: readonly ApiStyleProperty[];
}

interface StyleInput extends ApiMember {
  readonly selector: string;
}

interface StyleTemplate extends ApiTemplate {
  readonly selector: string;
}

const appearanceNames: ReadonlySet<string> = new Set<string>([
  'animation',
  'buttonShape',
  'dividers',
  'fluid',
  'inset',
  'orientation',
  'pageLinkSize',
  'pinFirstColumn',
  'placement',
  'presetSeverity',
  'resize',
  'rowHover',
  'scrollHeight',
  'shape',
  'showGridlines',
  'size',
  'severity',
  'status',
  'stickyHeader',
  'surface',
  'variant',
  'wrap',
  'zebra',
]);

const styleColumns: readonly TableColumn<ApiStyleProperty>[] = [
  { key: 'name', header: 'Property', value: (property: ApiStyleProperty): string => property.name, minWidth: '14rem' },
  {
    key: 'default',
    header: 'Default',
    value: (property: ApiStyleProperty): string => property.defaultValue,
    minWidth: '18rem',
  },
  {
    key: 'description',
    header: 'Description',
    value: (property: ApiStyleProperty): string => property.description,
    minWidth: '18rem',
  },
];

const inputColumns: readonly TableColumn<StyleInput>[] = [
  { key: 'selector', header: 'Element', value: (member: StyleInput): string => member.selector, minWidth: '10rem' },
  { key: 'name', header: 'Input', value: (member: StyleInput): string => member.name, minWidth: '10rem' },
  { key: 'type', header: 'Type', value: (member: StyleInput): string => member.type, minWidth: '12rem' },
  { key: 'default', header: 'Default', value: (member: StyleInput): string => member.defaultValue ?? '—', minWidth: '8rem' },
  {
    key: 'description',
    header: 'Effect',
    value: (member: StyleInput): string => member.description,
    minWidth: '18rem',
  },
];

const templateColumns: readonly TableColumn<StyleTemplate>[] = [
  { key: 'selector', header: 'Element', value: (template: StyleTemplate): string => template.selector, minWidth: '10rem' },
  { key: 'name', header: 'Template', value: (template: StyleTemplate): string => template.name, minWidth: '12rem' },
  {
    key: 'description',
    header: 'Customization',
    value: (template: StyleTemplate): string => template.description,
    minWidth: '20rem',
  },
];

@Component({
  selector: 'pg-styling-page',
  imports: [Badge, Card, CardTitle, Code, CodeLine, Table, TableCellTemplate],
  templateUrl: './styling.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylingPage {
  public readonly component: InputSignal<string> = input.required<string>();
  public readonly name: InputSignal<string> = input.required<string>();

  protected readonly styleColumns: readonly TableColumn<ApiStyleProperty>[] = styleColumns;
  protected readonly inputColumns: readonly TableColumn<StyleInput>[] = inputColumns;
  protected readonly templateColumns: readonly TableColumn<StyleTemplate>[] = templateColumns;
  protected readonly api: Signal<readonly ApiReferenceData[]> = computed(
    (): readonly ApiReferenceData[] => apiReferences[this.component()] ?? [],
  );
  protected readonly styleReferences: Signal<readonly StyleReference[]> = computed((): readonly StyleReference[] =>
    this.api().filter((reference: ApiReferenceData): reference is StyleReference => reference.styles.length > 0),
  );
  protected readonly appearanceInputs: Signal<readonly StyleInput[]> = computed((): readonly StyleInput[] =>
    this.api().flatMap((reference: ApiReferenceData): readonly StyleInput[] =>
      reference.members
        .filter((member: ApiMember): boolean =>
          member.kind === 'input' || member.kind === 'model' ? appearanceNames.has(member.name) : false,
        )
        .map((member: ApiMember): StyleInput => ({
          ...member,
          selector: reference.selector,
        })),
    ),
  );
  protected readonly templates: Signal<readonly StyleTemplate[]> = computed((): readonly StyleTemplate[] =>
    this.api().flatMap((reference: ApiReferenceData): readonly StyleTemplate[] =>
      reference.templates.map((template: ApiTemplate): StyleTemplate => ({
        ...template,
        selector: reference.selector,
      })),
    ),
  );

  protected exampleLines(reference: StyleReference): readonly string[] {
    const overrides: readonly ApiStyleProperty[] = reference.styles.filter(
      (property: ApiStyleProperty): boolean => property.exampleValue !== null,
    );
    if (overrides.length === 0) return [];

    return [
      `.custom-${this.component()} {`,
      ...overrides.map((property: ApiStyleProperty): string => `  ${property.name}: ${property.exampleValue};`),
      '}',
    ];
  }
}
