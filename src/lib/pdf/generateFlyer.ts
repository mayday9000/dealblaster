/**
 * Dynamic PDF generator that measures rendered sections and creates pages as needed.
 * Each section stays intact - never split across pages.
 * Preserves clickable links by mapping anchor positions to PDF coordinates.
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF Constants
const MARGIN = 40; // points
const GAP = 20; // points between sections
const PAGE_WIDTH = 612; // US Letter width in points
const PAGE_HEIGHT = 792; // US Letter height in points
const PRINTABLE_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const AVAILABLE_HEIGHT = PAGE_HEIGHT - (MARGIN * 2);

interface GenerateFlyerOptions {
  fileName?: string;
  backgroundColor?: string;
  canvasScale?: number;
}

/**
 * Checks if a section element has meaningful content
 */
export const isSectionEmpty = (element: HTMLElement): boolean => {
  const textContent = element.textContent?.trim() || '';
  
  // Check for text content
  if (textContent.length > 0) {
    // Ignore sections with only whitespace or placeholder text
    const meaningfulText = textContent.replace(/\s+/g, ' ').trim();
    if (meaningfulText && meaningfulText !== 'N/A' && meaningfulText !== '-') {
      return false;
    }
  }
  
  // Check for images
  const images = element.querySelectorAll('img');
  if (images.length > 0) {
    return false;
  }
  
  // Check for form inputs with values
  const inputs = element.querySelectorAll('input, select, textarea');
  for (const input of inputs) {
    if ((input as HTMLInputElement).value?.trim()) {
      return false;
    }
  }
  
  return true;
};

/**
 * Maps anchor links within a section to PDF link annotations
 */
const mapSectionLinks = (
  doc: jsPDF,
  sectionElement: HTMLElement,
  sectionX: number,
  sectionY: number,
  scaleFactor: number
) => {
  const anchors = Array.from(sectionElement.querySelectorAll('a[href]')) as HTMLAnchorElement[];
  
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    
    const rect = anchor.getBoundingClientRect();
    const sectionRect = sectionElement.getBoundingClientRect();
    
    // Calculate position relative to section
    const relativeX = rect.left - sectionRect.left;
    const relativeY = rect.top - sectionRect.top;
    
    // Convert to PDF coordinates
    const pdfX = sectionX + (relativeX * scaleFactor);
    const pdfY = sectionY + (relativeY * scaleFactor);
    const pdfWidth = rect.width * scaleFactor;
    const pdfHeight = rect.height * scaleFactor;
    
    // Add link annotation to PDF
    doc.link(pdfX, pdfY, pdfWidth, pdfHeight, { url: href });
  });
};

/**
 * Generates a PDF from an array of HTML section elements
 */
export const generateFlyer = async (
  sections: HTMLElement[],
  options: GenerateFlyerOptions = {}
): Promise<void> => {
  const {
    fileName = 'property-flyer.pdf',
    backgroundColor = '#ffffff',
    canvasScale = 2,
  } = options;

  const doc = new jsPDF('p', 'pt', 'letter');
  let currentY = MARGIN;
  let isFirstPage = true;

  try {
    for (const sectionElement of sections) {
      // Skip empty sections
      if (isSectionEmpty(sectionElement)) {
        continue;
      }

      // Render section to canvas
      const canvas = await html2canvas(sectionElement, {
        scale: canvasScale,
        backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const scaleFactor = PRINTABLE_WIDTH / canvas.width;
      let imgHeightPt = canvas.height * scaleFactor;

      // Handle oversized sections - scale down if needed
      if (imgHeightPt > AVAILABLE_HEIGHT) {
        const fitScale = AVAILABLE_HEIGHT / imgHeightPt;
        imgHeightPt = AVAILABLE_HEIGHT;
        
        // Re-render with adjusted scale for better quality
        const adjustedCanvas = await html2canvas(sectionElement, {
          scale: canvasScale * fitScale,
          backgroundColor,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        
        const adjustedImgData = adjustedCanvas.toDataURL('image/png');
        doc.addImage(adjustedImgData, 'PNG', MARGIN, currentY, PRINTABLE_WIDTH, imgHeightPt);
      } else {
        // Check if section fits on current page
        if (!isFirstPage && currentY + imgHeightPt > PAGE_HEIGHT - MARGIN) {
          doc.addPage();
          currentY = MARGIN;
        }

        // Add section image to PDF
        doc.addImage(imgData, 'PNG', MARGIN, currentY, PRINTABLE_WIDTH, imgHeightPt);
      }

      // Map clickable links
      mapSectionLinks(doc, sectionElement, MARGIN, currentY, scaleFactor);

      // Update position for next section
      currentY += imgHeightPt + GAP;
      isFirstPage = false;

      // Add small delay to keep UI responsive
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Save the PDF
    doc.save(fileName);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
