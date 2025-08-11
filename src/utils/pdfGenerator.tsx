import jsPDF from 'jspdf';

interface PDFData {
  title: string;
  subtitle: string;
  
  // Listing Headline
  city: string;
  dealType: string;
  hook: string;
  selectedTitle: string;
  
  // Basic Info
  address: string;
  askingPrice: string;
  financingTypes: string[];
  closingDate: string;
  
  // Photo Section
  photoLink: string;
  frontPhoto: File | null;
  
  // Property Overview
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  yearBuilt: string;
  zoning: string;
  lotSize: string;
  foundationType: string;
  utilities: string[];
  garage: string;
  pool: boolean;
  
  // Big Ticket Systems
  roofAge: string;
  roofSpecificAge: string;
  roofLastServiced: string;
  roofCondition: string;
  hvacAge: string;
  hvacSpecificAge: string;
  hvacLastServiced: string;
  hvacCondition: string;
  waterHeaterAge: string;
  waterHeaterSpecificAge: string;
  waterHeaterLastServiced: string;
  waterHeaterCondition: string;
  
  // Occupancy
  currentOccupancy: string;
  closingOccupancy: string;
  
  // Financial Snapshot
  includeFinancialBreakdown: boolean;
  arv: string;
  rehabEstimate: string;
  allIn: string;
  grossProfit: string;
  exitStrategy: string;
  
  // Comps
  comps: Array<{
    address: string;
    zillowLink: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    compType: string;
    conditionLabel: string;
    assetType: string;
  }>;
  
  // Contact Info
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  officeNumber: string;
  businessHours: string;
  contactImage: string | null; // Base64 data URL
  website: string;
  
  // Legal Disclosures
  memoFiled: boolean;
  emdAmount: string;
  emdDueDate: string;
  postPossession: boolean;
  additionalDisclosures: string;
}

class RealEstateListingPDF {
  private doc: jsPDF | null = null;
  private pageWidth = 8.5 * 72; // 8.5 inches in points
  private pageHeight = 11 * 72; // 11 inches in points
  private margin = 72; // 1 inch margin in points
  private contentWidth = this.pageWidth - (2 * this.margin);
  private currentY = this.margin;
  private lineHeight = 14;
  private sectionSpacing = 20;

  generatePDF(formData: PDFData) {
    this.doc = new jsPDF('p', 'pt', 'letter');
    this.currentY = this.margin;

    // Generate sections
    this.addHeader(formData);
    this.addPropertyImage(formData);
    this.addBasicInfo(formData);
    this.addPropertyOverview(formData);
    this.addBigTicketSystems(formData);
    this.addOccupancyInfo(formData);
    this.addFinancialSnapshot(formData);
    this.addComparables(formData);
    this.addContactInfo(formData);
    this.addLegalDisclosures(formData);

    return this.doc;
  }

  private addHeader(formData: PDFData) {
    // Add house emoji or icon
    this.doc!.setFontSize(24);
    this.doc!.text('🏠', this.margin, this.currentY + 20);
    
    // Main headline
    this.doc!.setFontSize(18);
    this.doc!.setFont(undefined, 'bold');
    
    const title = formData.selectedTitle || this.generateDefaultTitle(formData);
    const titleLines = this.wrapText(title, this.contentWidth - 40, 18);
    
    titleLines.forEach((line, index) => {
      this.doc!.text(line, this.margin + 40, this.currentY + 20 + (index * 22));
    });
    
    this.currentY += 20 + (titleLines.length * 22) + this.sectionSpacing;
  }

  private generateDefaultTitle(formData: PDFData) {
    const parts = [];
    if (formData.city) parts.push(`(${formData.city})`);
    if (formData.bedrooms) parts.push(`${formData.bedrooms} Bed`);
    if (formData.bathrooms) parts.push(`${formData.bathrooms} Bath`);
    if (formData.lotSize) parts.push(`on ${formData.lotSize}`);
    if (formData.dealType) parts.push(`${formData.dealType} Opportunity`);
    if (formData.hook) parts.push(`🔥`);
    
    return parts.join(' ');
  }

  private addPropertyImage(formData: PDFData) {
    if (formData.frontPhoto) {
      // Add image placeholder or actual image
      this.doc!.setDrawColor(200, 200, 200);
      this.doc!.setFillColor(245, 245, 245);
      this.doc!.rect(this.margin, this.currentY, this.contentWidth, 200, 'FD');
      
      this.doc!.setFontSize(12);
      this.doc!.setFont(undefined, 'normal');
      this.doc!.text('[Property Image]', this.margin + (this.contentWidth / 2) - 40, this.currentY + 100);
      
      this.currentY += 220;
    }

    // Address and photos link
    this.doc!.setFontSize(16);
    this.doc!.setFont(undefined, 'bold');
    this.doc!.text(`📍 ${formData.address}`, this.margin, this.currentY);
    this.currentY += 25;

    if (formData.photoLink) {
      this.doc!.setFontSize(12);
      this.doc!.setFont(undefined, 'normal');
      this.doc!.setTextColor(0, 100, 200);
      this.doc!.text(`📷 Photos: ${formData.photoLink}`, this.margin, this.currentY);
      this.doc!.setTextColor(0, 0, 0);
      this.currentY += 20;
    }

    // Closing date
    if (formData.closingDate) {
      this.doc!.setFontSize(12);
      this.doc!.text(`📅 Closing: ${formData.closingDate}`, this.margin, this.currentY);
      this.currentY += this.sectionSpacing;
    }
  }

  private addBasicInfo(formData: PDFData) {
    // Asking price and financing
    if (formData.askingPrice) {
      this.doc!.setFontSize(14);
      this.doc!.setFont(undefined, 'bold');
      this.doc!.text(`💰 Asking Price: ${formData.askingPrice}`, this.margin, this.currentY);
      this.currentY += 20;
    }

    if (formData.financingTypes && formData.financingTypes.length > 0) {
      this.doc!.setFontSize(12);
      this.doc!.setFont(undefined, 'normal');
      this.doc!.text(`Financing: ${formData.financingTypes.join(', ')}`, this.margin, this.currentY);
      this.currentY += this.sectionSpacing;
    }
  }

  private addPropertyOverview(formData: PDFData) {
    this.addSectionHeader('Property Overview');

    // Basic specs in grid format
    const specs = [];
    if (formData.bedrooms) specs.push(`🛏️ ${formData.bedrooms} Bed`);
    if (formData.bathrooms) specs.push(`🚿 ${formData.bathrooms} Bath`);
    if (formData.squareFootage) specs.push(`📐 ${formData.squareFootage} Sq Ft`);
    if (formData.yearBuilt) specs.push(`🏗️ Built: ${formData.yearBuilt}`);
    if (formData.foundationType) specs.push(`🏢 ${formData.foundationType}`);
    if (formData.lotSize) specs.push(`🌿 ${formData.lotSize} Lot`);

    // Display specs in 2-column layout
    specs.forEach((spec, index) => {
      const x = (index % 2 === 0) ? this.margin : this.margin + (this.contentWidth / 2);
      const y = this.currentY + Math.floor(index / 2) * this.lineHeight;
      this.doc!.text(spec, x, y);
    });

    this.currentY += Math.ceil(specs.length / 2) * this.lineHeight + 10;

    // Additional details
    if (formData.utilities && formData.utilities.length > 0) {
      this.doc!.text(`💧 ${formData.utilities.join(' & ')}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.zoning) {
      this.doc!.text(`⚖️ Zoning: ${formData.zoning}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.garage) {
      this.doc!.text(`🚗 ${formData.garage}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.pool) {
      this.doc!.text(`🏊 Pool`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    this.currentY += this.sectionSpacing;
  }

  private addBigTicketSystems(formData: PDFData) {
    const systems = [
      { name: 'Roof', prefix: 'roof', icon: '🏠' },
      { name: 'HVAC', prefix: 'hvac', icon: '❄️' },
      { name: 'Water Heater', prefix: 'waterHeater', icon: '🚿' }
    ];

    let hasSystemData = false;

    systems.forEach(system => {
      const age = formData[`${system.prefix}Age` as keyof PDFData] as string;
      const condition = formData[`${system.prefix}Condition` as keyof PDFData] as string;
      
      if (age || condition) {
        if (!hasSystemData) {
          this.addSectionHeader('Big Ticket Systems');
          hasSystemData = true;
        }

        let systemText = `${system.icon} ${system.name}:`;
        if (age) systemText += ` ${age} Years Old`;
        if (condition) systemText += ` • ${condition}`;
        
        this.doc!.text(systemText, this.margin, this.currentY);
        this.currentY += this.lineHeight;

        // Additional details
        const specificAge = formData[`${system.prefix}SpecificAge` as keyof PDFData] as string;
        const lastServiced = formData[`${system.prefix}LastServiced` as keyof PDFData] as string;
        
        if (specificAge || lastServiced) {
          let details = '';
          if (specificAge) details += `Specific Age: ${specificAge}`;
          if (lastServiced) details += `${details ? ' • ' : ''}Last Serviced: ${lastServiced}`;
          
          this.doc!.setFontSize(10);
          this.doc!.text(details, this.margin + 20, this.currentY);
          this.doc!.setFontSize(12);
          this.currentY += this.lineHeight;
        }
      }
    });

    if (hasSystemData) {
      this.currentY += this.sectionSpacing;
    }
  }

  private addOccupancyInfo(formData: PDFData) {
    if (formData.currentOccupancy || formData.closingOccupancy) {
      this.addSectionHeader('Occupancy Information');

      if (formData.currentOccupancy) {
        this.doc!.text(`Current: ${formData.currentOccupancy}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.closingOccupancy) {
        this.doc!.text(`At Closing: ${formData.closingOccupancy}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      this.currentY += this.sectionSpacing;
    }
  }

  private addFinancialSnapshot(formData: PDFData) {
    if (formData.includeFinancialBreakdown && 
        (formData.arv || formData.rehabEstimate || formData.allIn || formData.grossProfit)) {
      
      this.checkPageBreak(120);
      this.addSectionHeader('Financial Snapshot');

      if (formData.arv) {
        this.doc!.text(`ARV: ${formData.arv}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.rehabEstimate) {
        this.doc!.text(`Rehab Estimate: ${formData.rehabEstimate}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.allIn) {
        this.doc!.text(`All-In Cost: ${formData.allIn}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.grossProfit) {
        this.doc!.setFont(undefined, 'bold');
        this.doc!.text(`Gross Profit: ${formData.grossProfit}`, this.margin, this.currentY);
        this.doc!.setFont(undefined, 'normal');
        this.currentY += this.lineHeight;
      }

      if (formData.exitStrategy) {
        this.currentY += 10;
        this.doc!.text('Exit Strategy:', this.margin, this.currentY);
        this.currentY += this.lineHeight;
        
        const strategyLines = this.wrapText(formData.exitStrategy, this.contentWidth, 12);
        strategyLines.forEach(line => {
          this.doc!.text(line, this.margin, this.currentY);
          this.currentY += this.lineHeight;
        });
      }

      this.currentY += this.sectionSpacing;
    }
  }

  private addComparables(formData: PDFData) {
    if (formData.comps && formData.comps.length > 0) {
      this.checkPageBreak(100 + (formData.comps.length * 40));
      this.addSectionHeader('Comparable Properties');

      formData.comps.forEach((comp, index) => {
        this.doc!.setFont(undefined, 'bold');
        this.doc!.text(`Comp ${index + 1}:`, this.margin, this.currentY);
        this.doc!.setFont(undefined, 'normal');
        this.currentY += this.lineHeight;

        if (comp.address) {
          this.doc!.text(`Address: ${comp.address}`, this.margin + 10, this.currentY);
          this.currentY += this.lineHeight;
        }

        const compDetails = [];
        if (comp.bedrooms) compDetails.push(`${comp.bedrooms} Bed`);
        if (comp.bathrooms) compDetails.push(`${comp.bathrooms} Bath`);
        if (comp.squareFootage) compDetails.push(`${comp.squareFootage} Sq Ft`);
        if (comp.compType) compDetails.push(comp.compType);

        if (compDetails.length > 0) {
          this.doc!.text(compDetails.join(' • '), this.margin + 10, this.currentY);
          this.currentY += this.lineHeight;
        }

        if (comp.conditionLabel) {
          this.doc!.text(`Condition: ${comp.conditionLabel}`, this.margin + 10, this.currentY);
          this.currentY += this.lineHeight;
        }

        if (comp.zillowLink) {
          this.doc!.setTextColor(0, 100, 200);
          this.doc!.text(`Zillow: ${comp.zillowLink}`, this.margin + 10, this.currentY);
          this.doc!.setTextColor(0, 0, 0);
          this.currentY += this.lineHeight;
        }

        this.currentY += 10;
      });

      this.currentY += this.sectionSpacing;
    }
  }

  private addContactInfo(formData: PDFData) {
    this.checkPageBreak(120);
    this.addSectionHeader('Contact Information');

    if (formData.contactName) {
      this.doc!.setFont(undefined, 'bold');
      this.doc!.text(formData.contactName, this.margin, this.currentY);
      this.doc!.setFont(undefined, 'normal');
      this.currentY += this.lineHeight + 5;
    }

    if (formData.contactPhone) {
      this.doc!.text(`📞 ${formData.contactPhone}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.contactEmail) {
      this.doc!.text(`📧 ${formData.contactEmail}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.officeNumber) {
      this.doc!.text(`🏢 Office: ${formData.officeNumber}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (formData.website) {
      this.doc!.setTextColor(0, 100, 200);
      this.doc!.text(`🌐 ${formData.website}`, this.margin, this.currentY);
      this.doc!.setTextColor(0, 0, 0);
      this.currentY += this.lineHeight;
    }

    if (formData.businessHours) {
      this.doc!.text(`🕐 Hours: ${formData.businessHours}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    this.currentY += this.sectionSpacing;
  }

  private addLegalDisclosures(formData: PDFData) {
    if (formData.emdAmount || formData.emdDueDate || formData.memoFiled || 
        formData.postPossession || formData.additionalDisclosures) {
      
      this.checkPageBreak(100);
      this.addSectionHeader('Legal Disclosures');

      if (formData.emdAmount) {
        this.doc!.text(`EMD Amount: ${formData.emdAmount}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.emdDueDate) {
        this.doc!.text(`EMD Due Date: ${formData.emdDueDate}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.memoFiled) {
        this.doc!.text('✓ Memo of Contract Filed', this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.postPossession) {
        this.doc!.text('✓ Post-Possession Agreement', this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }

      if (formData.additionalDisclosures) {
        this.currentY += 5;
        this.doc!.text('Additional Disclosures:', this.margin, this.currentY);
        this.currentY += this.lineHeight;
        
        const disclosureLines = this.wrapText(formData.additionalDisclosures, this.contentWidth, 12);
        disclosureLines.forEach(line => {
          this.doc!.text(line, this.margin, this.currentY);
          this.currentY += this.lineHeight;
        });
      }
    }
  }

  private addSectionHeader(title: string) {
    this.currentY += 10;
    this.doc!.setFontSize(14);
    this.doc!.setFont(undefined, 'bold');
    this.doc!.text(title, this.margin, this.currentY);
    this.doc!.setFontSize(12);
    this.doc!.setFont(undefined, 'normal');
    this.currentY += 20;
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc!.addPage();
      this.currentY = this.margin;
    }
  }

  private wrapText(text: string, maxWidth: number, fontSize: number) {
    this.doc!.setFontSize(fontSize);
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = this.doc!.getTextWidth(testLine);
      
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Public method to generate and download PDF
  static generateAndDownload(formData: PDFData, filename = 'property-listing.pdf') {
    const generator = new RealEstateListingPDF();
    const pdf = generator.generatePDF(formData);
    pdf.save(filename);
  }
}

// Export function to maintain compatibility with existing form code
export const generatePDF = async (data: PDFData) => {
  const filename = `${data.city || 'Property'}_${data.dealType || 'Investment'}_Flyer.pdf`;
  RealEstateListingPDF.generateAndDownload(data, filename);
};

export default RealEstateListingPDF;