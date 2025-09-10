import { booleanAttribute, Directive, input } from '@angular/core';

let uid = 0;

@Directive({
  standalone: true,
  selector: 'bri-breadcrumb-item',
})
export class BriBreadcrumbItemDirective {
  readonly id = input(`${uid++}`);

  readonly label = input('');

  readonly url = input('');

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selected = input(false, { transform: booleanAttribute });
}
