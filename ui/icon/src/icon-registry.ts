import { Injectable } from '@angular/core';
import { BriIcon } from './types';

@Injectable({ providedIn: 'root' })
export class BriIconRegistry {
  private icons = new Map<string, BriIcon>();

  register(icons: BriIcon | BriIcon[]): void {
    const allIcons = Array.isArray(icons) ? icons : [icons];

    allIcons
      .filter(({ name }) => !this.icons.has(name))
      .forEach((icon) => this.icons.set(icon.name, icon));
  }

  get(name: string): BriIcon | undefined {
    return this.icons.get(name);
  }
}
