// Purpose: Centralize dynamic PDF section refs & ordering.

import { useRef } from 'react';

export type SectionKey =
  | 'property'
  | 'financial'
  | 'propertyDetails'
  | 'comps'
  | 'occupancy'
  | 'access'
  | 'emdClosing'
  | 'exitStrategy'
  | 'contact';

interface PdfSectionsHook {
  refs: Record<SectionKey, React.RefObject<HTMLDivElement>>;
  ordered: React.RefObject<HTMLDivElement>[];
  orderKeys: SectionKey[];
}

export function usePdfSections(): PdfSectionsHook {
  const refs = {
    property: useRef<HTMLDivElement>(null),
    financial: useRef<HTMLDivElement>(null),
    propertyDetails: useRef<HTMLDivElement>(null),
    comps: useRef<HTMLDivElement>(null),
    occupancy: useRef<HTMLDivElement>(null),
    access: useRef<HTMLDivElement>(null),
    emdClosing: useRef<HTMLDivElement>(null),
    exitStrategy: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  } as const;

  const orderKeys: SectionKey[] = [
    'property',
    'financial',
    'propertyDetails',
    'comps',
    'occupancy',
    'access',
    'emdClosing',
    'exitStrategy',
    'contact',
  ];

  const ordered = orderKeys.map(k => refs[k]);

  return { refs, ordered, orderKeys };
}