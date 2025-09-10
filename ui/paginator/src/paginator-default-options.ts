import { InjectionToken } from '@angular/core';

/** Object that can be used to configure the default options for the paginator module. */
export interface BriPaginatorDefaultOptions {
  /** Number of items to display on a page. By default set to 50. */
  pageSize?: number;

  /** The set of provided page size options to display to the user. */
  pageSizeOptions?: number[];

  /** Whether to hide the page size selection UI from the user. */
  hidePageSize?: boolean;

  /** Number of items visible */
  visiblePages?: number;
}

const defaultOptions: BriPaginatorDefaultOptions = {
  pageSize: 10,
  visiblePages: 3
};

/** Injection token that can be used to provide the default options for the paginator module. */
export const BRI_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<BriPaginatorDefaultOptions>(
  'BRI_PAGINATOR_DEFAULT_OPTIONS'
);

export function BRI_PAGINATOR_DEFAULT_OPTIONS_PROVIDER_FACTORY(parentDefaultOptions: BriPaginatorDefaultOptions) {
  return parentDefaultOptions || defaultOptions;
}

export const BRI_PAGINATOR_DEFAULT_OPTIONS_PROVIDER = {
  provide: BRI_PAGINATOR_DEFAULT_OPTIONS,
  useFactory: BRI_PAGINATOR_DEFAULT_OPTIONS_PROVIDER_FACTORY
};
