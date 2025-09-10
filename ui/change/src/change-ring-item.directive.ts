import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { BriChangeRingDirective } from './change-ring.directive';

@Component({
  standalone: true,
  template: '',
  styleUrl: './change-ring-item.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class _BriChangeRingItemStyeLoaderComponent {}

@Directive({
  standalone: true,
  selector: '[briChangeRingItem]',
  exportAs: 'briChangeRingItem',
  host: {
    class: 'bri-change-ring-item',
    '[class.bri-change-ring-item-active]': '_active()',
    '[style.outline-offset.px]': 'offset() ? offset() : null',
  },
})
export class BriChangeRingItemDirective {
  _briChangeRing = inject(BriChangeRingDirective);

  _active = computed(() => {
    const value = this._briChangeRing.value();
    const propertyNames = this.propertyNames();

    const allPropertiesNames = Array.isArray(propertyNames)
      ? propertyNames
      : [propertyNames];

    return value != null
      ? value.some((currentItem) => allPropertiesNames.includes(currentItem))
      : false;
  });

  propertyNames = input.required<string | string[]>({
    alias: 'briChangeRingItem',
  });

  offset = input(0, {
    transform: numberAttribute,
    alias: 'briChangeRingItemOffset',
  });
}
