/**
 * Dynamic PDF wrapper.
 * @deprecated The legacy static HTML template approach has been replaced by dynamic section-based pagination.
 */
import { generateDynamicFlyer } from './dynamicFlyer';
import { SectionKey } from '@/hooks/usePdfSections';

interface NewGeneratePdfArgs extends Record<string, any> {
  title: string;
  subtitle: string;
  sections?: { key: SectionKey; el: HTMLElement }[]; // Provided by caller
}

export async function generatePDF(args: NewGeneratePdfArgs) {
  const { sections = [], ...data } = args;
  return generateDynamicFlyer({
    sections,
    data,
    enableLinks: true,
  });
}