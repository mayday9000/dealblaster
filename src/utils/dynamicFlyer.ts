// Purpose: Dynamic, section-based PDF generator using measured DOM sections.
// Keeps each section intact; performs pagination intelligently.

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SectionKey } from '@/hooks/usePdfSections';

interface GenerateDynamicFlyerOptions {
  fileName?: string;
  sections: { key: SectionKey; el: HTMLElement }[];
  data: any;
  margins?: number;
  gap?: number;
  enableLinks?: boolean;
}

export async function generateDynamicFlyer({
  fileName = 'FixFlipDeal.pdf',
  sections,
  data,
  margins = 40,
  gap = 20,
  enableLinks = true,
}: GenerateDynamicFlyerOptions) {
  const doc = new jsPDF('p', 'pt', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let currentY = margins;
  const printableWidth = pageWidth - margins * 2;

  for (const { key, el } of sections) {
    if (isSectionEmpty(el, key, data)) continue;

    // First pass: render at scale 2
    let scale = 2;
    let canvas = await html2canvas(el, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    let renderScaleFactor = printableWidth / canvas.width;
    let imgHeightPt = canvas.height * renderScaleFactor;
    const maxContentHeight = pageHeight - margins;

    // Oversize fallback (single giant section)
    if (imgHeightPt > maxContentHeight) {
      const fitScale = maxContentHeight / imgHeightPt;
      scale = scale * fitScale;
      canvas = await html2canvas(el, {
        scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      renderScaleFactor = printableWidth / canvas.width;
      imgHeightPt = canvas.height * renderScaleFactor;
    }

    // Page break if needed
    if (currentY + imgHeightPt > pageHeight - margins) {
      doc.addPage();
      currentY = margins;
    }

    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', margins, currentY, printableWidth, imgHeightPt);

    if (enableLinks) {
      addLinksForSection(doc, el, {
        sectionTopY: currentY,
        sectionLeftX: margins,
        renderScaleFactor,
        htmlCanvasWidth: canvas.width,
        pageWidth,
        pageHeight,
      });
    }

    currentY += imgHeightPt + gap;
  }

  doc.save(fileName);
}

// Heuristic emptiness check
function isSectionEmpty(el: HTMLElement, key: SectionKey, data: any): boolean {
  const text = el.innerText.replace(/\s+/g, '');
  if (text.length > 0) {
    // But also allow ignoring boilerplate labels only
    const meaningful = el.querySelector('input, textarea, a');
    if (meaningful) {
      const populatedInputs = Array.from(el.querySelectorAll('input, textarea'))
        .some((n: any) => !!n.value?.toString().trim());
      if (populatedInputs) return false;
    }
  }

  switch (key) {
    case 'comps': {
      const arrays = [
        ...(data.pendingComps || []),
        ...(data.soldComps || []),
        ...(data.rentalComps || []),
        ...(data.newConstructionComps || []),
        ...(data.asIsComps || []),
      ];
      return arrays.filter(Boolean).map((s: string) => s.trim()).filter(Boolean).length === 0;
    }
    case 'financial':
      return !(data.purchasePrice || data.arv || data.rehabEstimate);
    case 'property':
      return !data.address;
    case 'exitStrategy':
      return !(data.exitStrategy || data.rentalBackupDetails);
    default:
      return !text.length;
  }
}

interface LinkOverlayCtx {
  sectionTopY: number;
  sectionLeftX: number;
  renderScaleFactor: number;
  htmlCanvasWidth: number;
  pageWidth: number;
  pageHeight: number;
}

function addLinksForSection(
  doc: jsPDF,
  sectionEl: HTMLElement,
  ctx: LinkOverlayCtx
) {
  const anchors = Array.from(sectionEl.querySelectorAll<HTMLAnchorElement>('a[href]'));
  if (!anchors.length) return;

  const sectionRect = sectionEl.getBoundingClientRect();

  for (const a of anchors) {
    const href = a.getAttribute('href');
    if (!href) continue;

    const r = a.getBoundingClientRect();
    const relX = r.left - sectionRect.left;
    const relY = r.top - sectionRect.top;

    const x = ctx.sectionLeftX + relX * ctx.renderScaleFactor;
    const y = ctx.sectionTopY + relY * ctx.renderScaleFactor;
    const w = r.width * ctx.renderScaleFactor;
    const h = r.height * ctx.renderScaleFactor;

    doc.link(x, y, w, h, { url: href });
  }
}
