import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFData {
  title: string;
  subtitle: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize: number;
  zoning: string;
  purchasePrice: number;
  rehabEstimate: number;
  arv: number;
  sellingCosts: number;
  netProfit: number;
  
  // Property details
  roofAge: string;
  roofCondition: string;
  roofNotes: string;
  hvacAge: string;
  hvacCondition: string;
  hvacNotes: string;
  waterHeaterAge: string;
  waterHeaterCondition: string;
  waterHeaterNotes: string;
  sidingType: string;
  sidingCondition: string;
  sidingNotes: string;
  additionalNotes: string;
  
  // Comps
  pendingComps: string[];
  soldComps: string[];
  rentalComps: string[];
  newConstructionComps: string[];
  asIsComps: string[];
  
  // Occupancy
  occupancy: string;
  leaseTerms: string;
  
  // Access
  access: string;
  lockboxCode: string;
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessHours: string;
  
  // EMD
  emdAmount: number;
  emdDueDate: string;
  memoFiled: boolean;
  
  // Other
  photoLink: string;
  exitStrategy: string;
  rentalBackup: boolean;
  rentalBackupDetails: string;
  closingDate: Date | undefined;
}

export const generatePDF = async (data: PDFData): Promise<void> => {
  // Calculate derived values
  const totalInvestment = data.purchasePrice + data.rehabEstimate;
  const grossProfit = data.arv - totalInvestment;
  const sellingCostAmount = Math.round(data.arv * (data.sellingCosts / 100));
  const netProfit = grossProfit - sellingCostAmount;
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
  };

  // Helper function to add text with proper line wrapping
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const lines = pdf.splitTextToSize(text, options.maxWidth || contentWidth);
    pdf.text(lines, x, y, options);
    return lines.length * (options.lineHeight || 7);
  };

  // Helper function to add clickable link
  const addLink = (text: string, url: string, x: number, y: number, maxWidth: number = contentWidth) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text(lines, x, y);
    
    // Add clickable link annotation - simplified version without getFontSize
    const fontSize = 10; // Use default font size
    const textWidth = pdf.getStringUnitWidth(lines[0]) * fontSize / pdf.internal.scaleFactor;
    const lineHeight = fontSize / pdf.internal.scaleFactor;
    
    pdf.link(x, y - lineHeight, textWidth, lineHeight, { url: url });
    
    pdf.setTextColor(0, 0, 0); // Reset to black
    return lines.length * 7;
  };

  // Header Section
  pdf.setFillColor(59, 130, 246);
  pdf.rect(margin, currentY, contentWidth, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  currentY += 15;
  addText(data.title, margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 10;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  addText(data.subtitle, margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 15;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  addText(`📍 ${data.address}`, margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 20;
  pdf.setTextColor(0, 0, 0);

  // Financial Breakdown Section
  checkPageBreak(80);
  pdf.setFillColor(16, 185, 129);
  pdf.rect(margin, currentY, contentWidth, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  currentY += 12;
  addText('💰 Financial Breakdown', margin + 5, currentY);
  
  currentY += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  
  // Financial grid
  const financialItems = [
    ['Purchase Price', `$${data.purchasePrice.toLocaleString()}`],
    ['Rehab Estimate', `$${data.rehabEstimate.toLocaleString()}`],
    ['Total Investment', `$${totalInvestment.toLocaleString()}`],
    ['After Repair Value', `$${data.arv.toLocaleString()}`]
  ];
  
  const itemWidth = contentWidth / 2;
  let itemX = margin;
  let itemY = currentY;
  
  financialItems.forEach((item, index) => {
    if (index % 2 === 0 && index > 0) {
      itemY += 25;
      itemX = margin;
    }
    
    pdf.setFillColor(248, 250, 252);
    pdf.rect(itemX, itemY, itemWidth - 5, 20, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(itemX, itemY, itemWidth - 5, 20);
    
    pdf.setFont(undefined, 'normal');
    pdf.text(item[0], itemX + 3, itemY + 8);
    pdf.setFont(undefined, 'bold');
    pdf.text(item[1], itemX + 3, itemY + 15);
    
    itemX = index % 2 === 0 ? margin + itemWidth : margin;
  });
  
  currentY = itemY + 35;
  
  // Gross Profit Highlight
  pdf.setFillColor(245, 158, 11);
  pdf.rect(margin, currentY, contentWidth, 25, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  addText('Gross Profit', margin + 5, currentY + 8, { align: 'center', maxWidth: contentWidth - 10 });
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  addText(`$${grossProfit.toLocaleString()}`, margin + 5, currentY + 20, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 35;
  pdf.setTextColor(0, 0, 0);

  // Property Overview Section
  checkPageBreak(60);
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  addText('🏠 Property Overview', margin, currentY);
  currentY += 10;
  
  const propertyItems = [
    ['🛏️', data.beds.toString(), 'Bedrooms'],
    ['🛁', data.baths.toString(), 'Bathrooms'],
    ['📐', data.sqft.toLocaleString(), 'Square Feet'],
    ['📏', data.lotSize.toString(), 'Acre Lot'],
    ['🏗️', data.yearBuilt.toString(), 'Year Built'],
    ['📚', data.zoning, 'Zoning']
  ];
  
  const propItemWidth = contentWidth / 3;
  let propX = margin;
  let propY = currentY;
  
  propertyItems.forEach((item, index) => {
    if (index % 3 === 0 && index > 0) {
      propY += 30;
      propX = margin;
    }
    
    pdf.setFillColor(248, 250, 252);
    pdf.rect(propX, propY, propItemWidth - 5, 25, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(propX, propY, propItemWidth - 5, 25);
    
    pdf.setFontSize(16);
    pdf.text(item[0], propX + propItemWidth/2 - 5, propY + 8, { align: 'center' });
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(item[1], propX + propItemWidth/2, propY + 15, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.text(item[2], propX + propItemWidth/2, propY + 20, { align: 'center' });
    
    propX = (index % 3 + 1) * propItemWidth + margin;
  });
  
  currentY = propY + 40;

  // Photo Link Section
  if (data.photoLink) {
    checkPageBreak(20);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    addText('📸 Property Photos', margin, currentY);
    currentY += 10;
    
    const linkHeight = addLink('Click Here → View Photos', data.photoLink, margin, currentY, contentWidth);
    currentY += linkHeight + 10;
  }

  // Property Details Section
  const hasPropertyDetails = data.roofAge || data.roofCondition || data.roofNotes || 
                           data.hvacAge || data.hvacCondition || data.hvacNotes ||
                           data.waterHeaterAge || data.waterHeaterCondition || data.waterHeaterNotes ||
                           data.sidingType || data.sidingCondition || data.sidingNotes || data.additionalNotes;

  if (hasPropertyDetails) {
    checkPageBreak(60);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('🔍 Property Details', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    if (data.roofAge || data.roofCondition || data.roofNotes) {
      pdf.setFont(undefined, 'bold');
      addText('Roof:', margin, currentY);
      pdf.setFont(undefined, 'normal');
      let roofText = '';
      if (data.roofAge) roofText += `Age: ${data.roofAge}`;
      if (data.roofCondition) roofText += ` | Condition: ${data.roofCondition}`;
      if (data.roofNotes) roofText += ` | Notes: ${data.roofNotes}`;
      currentY += addText(roofText, margin + 15, currentY, { maxWidth: contentWidth - 15 });
      currentY += 5;
    }
    
    if (data.hvacAge || data.hvacCondition || data.hvacNotes) {
      pdf.setFont(undefined, 'bold');
      addText('HVAC:', margin, currentY);
      pdf.setFont(undefined, 'normal');
      let hvacText = '';
      if (data.hvacAge) hvacText += `Age: ${data.hvacAge}`;
      if (data.hvacCondition) hvacText += ` | Condition: ${data.hvacCondition}`;
      if (data.hvacNotes) hvacText += ` | Notes: ${data.hvacNotes}`;
      currentY += addText(hvacText, margin + 15, currentY, { maxWidth: contentWidth - 15 });
      currentY += 5;
    }
    
    if (data.waterHeaterAge || data.waterHeaterCondition || data.waterHeaterNotes) {
      pdf.setFont(undefined, 'bold');
      addText('Hot Water Heater:', margin, currentY);
      pdf.setFont(undefined, 'normal');
      let waterText = '';
      if (data.waterHeaterAge) waterText += `Age: ${data.waterHeaterAge}`;
      if (data.waterHeaterCondition) waterText += ` | Condition: ${data.waterHeaterCondition}`;
      if (data.waterHeaterNotes) waterText += ` | Notes: ${data.waterHeaterNotes}`;
      currentY += addText(waterText, margin + 15, currentY, { maxWidth: contentWidth - 15 });
      currentY += 5;
    }
    
    if (data.sidingType || data.sidingCondition || data.sidingNotes) {
      pdf.setFont(undefined, 'bold');
      addText('Siding:', margin, currentY);
      pdf.setFont(undefined, 'normal');
      let sidingText = '';
      if (data.sidingType) sidingText += `Type: ${data.sidingType}`;
      if (data.sidingCondition) sidingText += ` | Condition: ${data.sidingCondition}`;
      if (data.sidingNotes) sidingText += ` | Notes: ${data.sidingNotes}`;
      currentY += addText(sidingText, margin + 15, currentY, { maxWidth: contentWidth - 15 });
      currentY += 5;
    }
    
    if (data.additionalNotes) {
      pdf.setFont(undefined, 'bold');
      addText('Additional Notes:', margin, currentY);
      pdf.setFont(undefined, 'normal');
      currentY += addText(data.additionalNotes, margin + 15, currentY, { maxWidth: contentWidth - 15 });
      currentY += 5;
    }
    
    currentY += 10;
  }

  // Exit Strategy Section
  if (data.exitStrategy) {
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('📋 Exit Strategy Notes', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    currentY += addText(data.exitStrategy, margin, currentY, { maxWidth: contentWidth });
    currentY += 15;
  }

  // Comps Section
  const hasComps = [data.pendingComps, data.soldComps, data.rentalComps, data.newConstructionComps, data.asIsComps]
    .some(comps => comps.some(comp => comp.trim()));

  if (hasComps) {
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('📊 Comps', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(10);
    
    const compSections = [
      { comps: data.pendingComps, title: 'Pending Flipped Comps' },
      { comps: data.soldComps, title: 'Sold Flipped Comps' },
      { comps: data.rentalComps, title: 'Rental Comps' },
      { comps: data.newConstructionComps, title: 'New Construction Comps' },
      { comps: data.asIsComps, title: 'Sold As-Is Comps' }
    ];
    
    compSections.forEach(section => {
      if (section.comps.some(comp => comp.trim())) {
        checkPageBreak(20 + section.comps.filter(comp => comp.trim()).length * 7);
        
        pdf.setFont(undefined, 'bold');
        addText(section.title, margin, currentY);
        currentY += 10;
        
        pdf.setFont(undefined, 'normal');
        section.comps.filter(comp => comp.trim()).forEach((comp, index) => {
          addText(`${index + 1}.`, margin + 5, currentY);
          const linkHeight = addLink(comp, comp, margin + 15, currentY, contentWidth - 20);
          currentY += linkHeight + 2;
        });
        currentY += 10;
      }
    });
  }

  // Occupancy Section
  if (data.occupancy) {
    checkPageBreak(25);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('🏡 Occupancy', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    addText(data.occupancy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), margin, currentY);
    currentY += 10;
    
    if (data.leaseTerms) {
      pdf.setFont(undefined, 'italic');
      currentY += addText(`Lease Terms: ${data.leaseTerms}`, margin, currentY, { maxWidth: contentWidth });
    }
    currentY += 15;
  }

  // Access Section
  if (data.access) {
    checkPageBreak(25);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('🔐 Access', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    addText(data.access.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), margin, currentY);
    currentY += 10;
    
    if (data.lockboxCode) {
      pdf.setFont(undefined, 'italic');
      addText(`Lockbox Code: ${data.lockboxCode}`, margin, currentY);
      currentY += 10;
    }
    currentY += 15;
  }

  // Rental Backup Section
  if (data.rentalBackup) {
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    addText('💎 Bonus: Rental Backup Plan', margin, currentY);
    currentY += 15;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    currentY += addText(data.rentalBackupDetails, margin, currentY, { maxWidth: contentWidth });
    currentY += 15;
  }

  // Memo Alert
  if (data.memoFiled) {
    checkPageBreak(20);
    pdf.setFillColor(254, 243, 199);
    pdf.rect(margin, currentY, contentWidth, 15, 'F');
    pdf.setDrawColor(245, 158, 11);
    pdf.rect(margin, currentY, contentWidth, 15);
    
    pdf.setTextColor(146, 64, 14);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    currentY += 10;
    addText('⚠️ MEMORANDUM OF CONTRACT FILED ON THIS PROPERTY TO PROTECT THE FINANCIAL INTEREST OF SELLER AND BUYER', margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
    currentY += 15;
    pdf.setTextColor(0, 0, 0);
  }

  // Contact Information Section
  checkPageBreak(50);
  pdf.setFillColor(59, 130, 246);
  pdf.rect(margin, currentY, contentWidth, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  currentY += 12;
  addText('📞 Contact Information', margin + 5, currentY);
  
  currentY += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  
  const contactItems = [
    ['Name/Company', data.contactName],
    ['Phone', data.contactPhone],
    ['Email', data.contactEmail],
    ['Business Hours', data.businessHours]
  ];
  
  const contactItemWidth = contentWidth / 2;
  let contactX = margin;
  let contactY = currentY;
  
  contactItems.forEach((item, index) => {
    if (index % 2 === 0 && index > 0) {
      contactY += 20;
      contactX = margin;
    }
    
    pdf.setFillColor(248, 250, 252);
    pdf.rect(contactX, contactY, contactItemWidth - 5, 15, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(contactX, contactY, contactItemWidth - 5, 15);
    
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    pdf.text(item[0], contactX + 3, contactY + 6);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text(item[1], contactX + 3, contactY + 12);
    
    contactX = index % 2 === 0 ? margin + contactItemWidth : margin;
  });
  
  currentY = contactY + 30;

  // CTA Section
  checkPageBreak(40);
  pdf.setFillColor(220, 38, 38);
  pdf.rect(margin, currentY, contentWidth, 35, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  currentY += 12;
  addText('🚨 THIS DEAL WILL NOT LAST LONG', margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 10;
  pdf.setFontSize(12);
  addText('PUT YOUR OFFER IN TODAY', margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });
  
  currentY += 15;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  addText(`EMD Amount: $${data.emdAmount.toLocaleString()}`, margin + 5, currentY);
  addText(`Closing Date: ${data.closingDate ? data.closingDate.toLocaleDateString() : 'TBD'}`, margin + contentWidth/2, currentY);
  
  currentY += 8;
  pdf.setFont(undefined, 'bold');
  addText('EMD DUE WITHIN 24HR OF EXECUTED CONTRACT', margin + 5, currentY, { align: 'center', maxWidth: contentWidth - 10 });

  // Download the PDF
  const fileName = `Fix-Flip-Flyer-${data.address.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
