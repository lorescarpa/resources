import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BriIconRegistry } from './icon-registry';

// const svgContent = `<svg class="testing" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.9998 0L2.6665 12.4427C4.51006 14.1582 7.49317 14.1582 9.33317 12.4427L13.6443 8.42133V32L18.3572 31.9982V8.42133L22.6665 12.4427C24.5065 14.1582 27.4932 14.1582 29.3332 12.4427L15.9998 0Z" fill="#262626"/></svg>`;

@Component({
  standalone: true,
  selector: 'bri-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  host: {
    role: 'img',
    'aria-hidden': 'true',
    '[attr.aria-label]': 'name ? name + "-icon" : ""',
    class: 'bri-icon',
  },
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriIconComponent {
  private _document = inject(DOCUMENT);
  private _elementRef = inject(ElementRef);

  private _iconRegistry = inject(BriIconRegistry);

  @Input() set name(value: string) {
    const icon = this._iconRegistry.get(value);

    if (icon == null && isDevMode()) {
      throw Error(`Icon ${value} not registered`);
    }

    if (icon != null) {
      const svg = this._generateSvgFromContent(icon?.data);
      this._elementRef.nativeElement.innerHTML = svg.outerHTML;
    }
  }

  private _generateSvgFromContent(content: string): SVGElement {
    const div = this._document.createElement('div');
    div.innerHTML = content;

    const svg = div.querySelector('svg') as SVGElement;
    svg.setAttribute('fit', '');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');

    return svg;
  }
}
