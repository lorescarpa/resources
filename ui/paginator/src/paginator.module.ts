import { NgModule } from '@angular/core';
import { BriPaginatorComponent } from './paginator.component';
import { BriButtonModule } from '@wkp/bricks/button';
import { BRI_PAGINATOR_DEFAULT_OPTIONS_PROVIDER } from './paginator-default-options';
import { BriCompressedPaginatorComponent } from './compressed-paginator.component';

const PAGINATOR_DECLARATIONS = [
  BriCompressedPaginatorComponent,
  BriPaginatorComponent,
];

@NgModule({
  imports: [BriButtonModule, PAGINATOR_DECLARATIONS],
  exports: PAGINATOR_DECLARATIONS,
  providers: [BRI_PAGINATOR_DEFAULT_OPTIONS_PROVIDER],
})
export class BriPaginatorModule {}
