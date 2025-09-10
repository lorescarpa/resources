import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { faker } from '@faker-js/faker';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { BriSort, BriSortDirective, BriSortModule } from '@wkp/bricks/sort';
import { z } from 'zod';
import { BriTableDataSource, BriTableModule } from '../src';

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  jobType: z.string().min(1),
  jobTitle: z.string().optional(),
});

type User = z.infer<typeof userSchema>;

const generateMockUser = (): User => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    jobType: faker.person.jobType(),
    jobTitle: faker.person.jobTitle(),
  };
};

const generateMockUsers = (instancesNum: number): User[] =>
  Array(instancesNum).fill(undefined).map(generateMockUser);

@Component({
  template: `
    <table
      bri-table
      [dataSource]="_dataSource"
      briSort
      (briSortChange)="onSortChange($event)"
      style="min-width: 800px;"
    >
      <ng-container briColumnDef="firstName">
        <th bri-header-cell *briHeaderCellDef bri-sort-header>FirstName</th>
        <td bri-cell *briCellDef="let user">{{ user?.firstName }}</td>
      </ng-container>
      <ng-container briColumnDef="lastName">
        <th bri-header-cell *briHeaderCellDef bri-sort-header>LastName</th>
        <td bri-cell *briCellDef="let user">{{ user?.lastName }}</td>
      </ng-container>
      <ng-container briColumnDef="jobType">
        <th bri-header-cell *briHeaderCellDef>JobType</th>
        <td bri-cell *briCellDef="let user">{{ user?.jobType }}</td>
      </ng-container>
      <ng-container briColumnDef="jobTitle">
        <th bri-header-cell *briHeaderCellDef>JobTitle</th>
        <td bri-cell *briCellDef="let user">{{ user?.jobTitle }}</td>
      </ng-container>
      <tr bri-header-row *briHeaderRowDef="_displayedColumns"></tr>
      <tr bri-row *briRowDef="let row; columns: _displayedColumns"></tr>
    </table>
  `,
  imports: [BriSortModule, BriTableModule],
  standalone: true,
})
class DummyComponent implements AfterViewInit {
  _displayedColumns: string[] = [
    'firstName',
    'lastName',
    'jobType',
    'jobTitle',
  ];

  _users: User[] = generateMockUsers(10);

  _dataSource = new BriTableDataSource<User>(this._users);

  @ViewChild(BriSortDirective) _sort!: BriSortDirective;

  ngAfterViewInit(): void {
    this._dataSource.sort = this._sort;
  }

  onSortChange(event: BriSort): void {
    console.log('on sort change', event);
  }
}

const meta: Meta<DummyComponent> = {
  title: 'Table',
  component: DummyComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<DummyComponent>;

export const Primary: Story = {};
