import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table, TableColumn } from '@sushi-kit/angular';

interface Member {
  readonly name: string;
  readonly role: string;
  readonly location: string;
}

@Component({
  selector: 'pg-table-appearance-example',
  imports: [Table],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAppearanceExample {
  protected readonly columns: readonly TableColumn<Member>[] = [
    { key: 'name', header: 'Name', value: (member: Member): string => member.name, rowHeader: true, width: '30%' },
    { key: 'role', header: 'Role', value: (member: Member): string => member.role, width: '40%' },
    { key: 'location', header: 'Location', value: (member: Member): string => member.location, width: '30%' },
  ];
  protected readonly members: readonly Member[] = [
    { name: 'Avery Morgan', role: 'Product designer', location: 'Berlin' },
    { name: 'Jamie Chen', role: 'Frontend engineer', location: 'Toronto' },
    { name: 'Noah Williams', role: 'Research lead', location: 'London' },
    { name: 'Mina Park', role: 'Design engineer', location: 'Seoul' },
    { name: 'Leo Santos', role: 'Product manager', location: 'Lisbon' },
    { name: 'Samira Haddad', role: 'Data analyst', location: 'Paris' },
  ];
}
