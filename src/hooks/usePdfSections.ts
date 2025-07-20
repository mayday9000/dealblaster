/**
 * Hook for managing PDF section refs and rendering order.
 * Provides typed refs for each major PDF section and defines the priority order.
 */
import { useRef } from 'react';

export type SectionKey = 
  | 'header'
  | 'financial' 
  | 'propertyOverview'
  | 'propertyDetails'
  | 'comps'
  | 'occupancy'
  | 'access'
  | 'exitStrategy'
  | 'emdClosing'
  | 'contact';

export const usePdfSections = () => {
  const refs = {
    header: useRef<HTMLDivElement>(null),
    financial: useRef<HTMLDivElement>(null),
    propertyOverview: useRef<HTMLDivElement>(null),
    propertyDetails: useRef<HTMLDivElement>(null),
    comps: useRef<HTMLDivElement>(null),
    occupancy: useRef<HTMLDivElement>(null),
    access: useRef<HTMLDivElement>(null),
    exitStrategy: useRef<HTMLDivElement>(null),
    emdClosing: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Priority order for PDF generation
  const sectionOrder: SectionKey[] = [
    'header',
    'financial',
    'propertyOverview',
    'propertyDetails',
    'comps',
    'occupancy',
    'access',
    'exitStrategy',
    'emdClosing',
    'contact',
  ];

  const orderedRefs = sectionOrder.map(key => refs[key]);

  return {
    refs,
    sectionOrder,
    orderedRefs,
  };
};