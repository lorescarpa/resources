/* eslint-disable @angular-eslint/component-selector */
import { PortalModule } from '@angular/cdk/portal';
import { CdkTableModule } from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BriSkeletonLoaderComponent } from '@wkp/bricks/skeleton-loader';
import {
  BriCellDefDirective,
  BriCellDirective,
  BriColumnDefDirective,
  BriHeaderCellDefDirective,
  BriHeaderCellDirective,
} from './cell';
import {
  BriHeaderRowComponent,
  BriHeaderRowDefDirective,
  BriRowComponent,
  BriRowDefDirective,
} from './row';
import { BriTableComponent } from './table.component';
import { CommonModule } from '@angular/common';

const imports = [
  BriCellDirective,
  BriCellDefDirective,
  BriColumnDefDirective,
  BriHeaderCellDirective,
  BriHeaderCellDefDirective,
  BriHeaderRowComponent,
  BriHeaderRowDefDirective,
  BriRowComponent,
  BriRowDefDirective,
  BriTableComponent,
  BriSkeletonLoaderComponent,
  CdkTableModule,
  CommonModule,
  PortalModule,
];

@Component({
  selector: '[bri-table-skeleton]',
  template: `
    <table
      bri-table
      [dataSource]="dataSource"
      style="width: 100%;"
      [ngClass]="classes()"
    >
      @for (columnKey of columnsKeys(); track columnKey) {
      <ng-container [briColumnDef]="columnKey">
        <th bri-header-cell *briHeaderCellDef>
          <bri-skeleton-loader style="height: 20px"></bri-skeleton-loader>
        </th>
        <td bri-cell *briCellDef="let value">
          <bri-skeleton-loader style="height: 20px"></bri-skeleton-loader>
        </td>
      </ng-container>
      }
      <tr bri-header-row *briHeaderRowDef="columnsKeys()"></tr>
      <tr bri-row *briRowDef="let row; columns: columnsKeys()"></tr>
    </table>
  `,
  styles: `
    .bri-table-skeleton {
      width: 100%;
    }
  `,
  imports,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BriTableSkeletonComponent {
  columns = input(2, { transform: numberAttribute });
  rows = input(1, { transform: numberAttribute });
  classes = input<string>();

  columnsKeys = computed(() => {
    const range = (n: any) =>
      Array.from({ length: n }, (value, key) => `${key}`);

    return range(this.columns());
  });

  dataSource = toObservable(
    computed(() => Array.from({ length: this.rows() }, () => ({})))
  );
}
