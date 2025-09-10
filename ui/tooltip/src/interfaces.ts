import { TemplateRef, Type } from '@angular/core';

export type BriTooltipPosition = 'below' | 'above';

export type BriTooltipDirection = 'left' | 'right';

export type BriTooltipContent = Type<unknown> | TemplateRef<unknown> | string;
