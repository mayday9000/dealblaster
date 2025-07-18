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
  
  // Helper function to format comps
  const formatComps = (comps: string[], title: string) => {
    if (!comps.length || !comps.some(comp => comp.trim())) return '';
    
    return `
      <div class="comp-section">
        <h3 class="comp-title">${title}</h3>
        ${comps.filter(comp => comp.trim()).map((comp, index) => `
          <div class="comp-item">
            <span class="comp-number">${index + 1}.</span>
            <a href="${comp}" class="comp-link" target="_blank">${comp}</a>
          </div>
        `).join('')}
      </div>
    `;
  };

  // Helper function to format property details
  const formatPropertyDetails = () => {
    const details = [];
    
    if (data.roofAge || data.roofCondition || data.roofNotes) {
      details.push(`
        <div class="detail-item">
          <strong>Roof:</strong> 
          ${data.roofAge ? `Age: ${data.roofAge}` : ''} 
          ${data.roofCondition ? `| Condition: ${data.roofCondition}` : ''}
          ${data.roofNotes ? `<br><em>${data.roofNotes}</em>` : ''}
        </div>
      `);
    }
    
    if (data.hvacAge || data.hvacCondition || data.hvacNotes) {
      details.push(`
        <div class="detail-item">
          <strong>HVAC:</strong> 
          ${data.hvacAge ? `Age: ${data.hvacAge}` : ''} 
          ${data.hvacCondition ? `| Condition: ${data.hvacCondition}` : ''}
          ${data.hvacNotes ? `<br><em>${data.hvacNotes}</em>` : ''}
        </div>
      `);
    }
    
    if (data.waterHeaterAge || data.waterHeaterCondition || data.waterHeaterNotes) {
      details.push(`
        <div class="detail-item">
          <strong>Hot Water Heater:</strong> 
          ${data.waterHeaterAge ? `Age: ${data.waterHeaterAge}` : ''} 
          ${data.waterHeaterCondition ? `| Condition: ${data.waterHeaterCondition}` : ''}
          ${data.waterHeaterNotes ? `<br><em>${data.waterHeaterNotes}</em>` : ''}
        </div>
      `);
    }
    
    if (data.sidingType || data.sidingCondition || data.sidingNotes) {
      details.push(`
        <div class="detail-item">
          <strong>Siding:</strong> 
          ${data.sidingType ? `Type: ${data.sidingType}` : ''} 
          ${data.sidingCondition ? `| Condition: ${data.sidingCondition}` : ''}
          ${data.sidingNotes ? `<br><em>${data.sidingNotes}</em>` : ''}
        </div>
      `);
    }
    
    if (data.additionalNotes) {
      details.push(`
        <div class="detail-item">
          <strong>Additional Notes:</strong> ${data.additionalNotes}
        </div>
      `);
    }
    
    return details.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🔍 Property Details</h2>
        ${details.join('')}
      </div>
    ` : '';
  };

  // Create sections that will be rendered on separate pages
  const sections = [
    {
      id: 'page1',
      content: `
        <div class="header">
          <h1 class="title">${data.title}</h1>
          <p class="subtitle">${data.subtitle}</p>
          <div class="address">📍 ${data.address}</div>
        </div>
        
        <div class="financial-section">
          <h2 class="financial-title">💰 Financial Breakdown</h2>
          <div class="financial-grid">
            <div class="financial-item">
              <div class="financial-label">Purchase Price</div>
              <div class="financial-value">$${data.purchasePrice.toLocaleString()}</div>
            </div>
            <div class="financial-item">
              <div class="financial-label">Rehab Estimate</div>
              <div class="financial-value">$${data.rehabEstimate.toLocaleString()}</div>
            </div>
            <div class="financial-item">
              <div class="financial-label">Total Investment</div>
              <div class="financial-value">$${totalInvestment.toLocaleString()}</div>
            </div>
            <div class="financial-item">
              <div class="financial-label">After Repair Value</div>
              <div class="financial-value">$${data.arv.toLocaleString()}</div>
            </div>
          </div>
          
          <div class="gross-profit">
            <div class="financial-label">Gross Profit</div>
            <div class="gross-profit-value">$${grossProfit.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">🏠 Property Overview</h2>
          <div class="property-overview">
            <div class="property-item">
              <div class="property-icon">🛏️</div>
              <div class="property-value">${data.beds}</div>
              <div class="property-label">Bedrooms</div>
            </div>
            <div class="property-item">
              <div class="property-icon">🛁</div>
              <div class="property-value">${data.baths}</div>
              <div class="property-label">Bathrooms</div>
            </div>
            <div class="property-item">
              <div class="property-icon">📐</div>
              <div class="property-value">${data.sqft.toLocaleString()}</div>
              <div class="property-label">Square Feet</div>
            </div>
            <div class="property-item">
              <div class="property-icon">📏</div>
              <div class="property-value">${data.lotSize}</div>
              <div class="property-label">Acre Lot</div>
            </div>
            <div class="property-item">
              <div class="property-icon">🏗️</div>
              <div class="property-value">${data.yearBuilt}</div>
              <div class="property-label">Year Built</div>
            </div>
            <div class="property-item">
              <div class="property-icon">📚</div>
              <div class="property-value">${data.zoning}</div>
              <div class="property-label">Zoning</div>
            </div>
          </div>
        </div>
        
        ${data.photoLink ? `
          <div class="photo-section">
            <h3>📸 Property Photos</h3>
            <a href="${data.photoLink}" class="photo-link" target="_blank">
              Click Here → View Photos
            </a>
          </div>
        ` : ''}
        
        ${formatPropertyDetails()}
      `
    }
  ];

  // Add page 2 with exit strategy, comps, and occupancy
  if (data.exitStrategy || [data.pendingComps, data.soldComps, data.rentalComps, data.newConstructionComps, data.asIsComps].some(comps => comps.some(comp => comp.trim())) || data.occupancy) {
    sections.push({
      id: 'page2',
      content: `
        ${data.exitStrategy ? `
          <div class="section">
            <h2 class="section-title">📋 Exit Strategy Notes</h2>
            <p>${data.exitStrategy}</p>
          </div>
        ` : ''}
        
        ${[data.pendingComps, data.soldComps, data.rentalComps, data.newConstructionComps, data.asIsComps].some(comps => comps.some(comp => comp.trim())) ? `
          <div class="section">
            <h2 class="section-title">📊 Comps</h2>
            ${formatComps(data.pendingComps, 'Pending Flipped Comps')}
            ${formatComps(data.soldComps, 'Sold Flipped Comps')}
            ${formatComps(data.rentalComps, 'Rental Comps')}
            ${formatComps(data.newConstructionComps, 'New Construction Comps')}
            ${formatComps(data.asIsComps, 'Sold As-Is Comps')}
          </div>
        ` : ''}
        
        ${data.occupancy ? `
          <div class="occupancy-section">
            <h3 class="occupancy-title">🏡 Occupancy</h3>
            <p><strong>${data.occupancy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong></p>
            ${data.leaseTerms ? `<p><em>Lease Terms: ${data.leaseTerms}</em></p>` : ''}
          </div>
        ` : ''}
      `
    });
  }

  // Add page 3 with access information
  if (data.access) {
    sections.push({
      id: 'page3',
      content: `
        <div class="access-section">
          <h3 class="access-title">🔐 Access</h3>
          <p><strong>${data.access.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong></p>
          ${data.lockboxCode ? `<p><em>Lockbox Code: ${data.lockboxCode}</em></p>` : ''}
        </div>
        
        ${data.rentalBackup ? `
          <div class="rental-backup">
            <h3 class="rental-backup-title">💎 Bonus: Rental Backup Plan</h3>
            <p>${data.rentalBackupDetails}</p>
          </div>
        ` : ''}
        
        ${data.memoFiled ? `
          <div class="memo-alert">
            ⚠️ MEMORANDUM OF CONTRACT FILED ON THIS PROPERTY TO PROTECT THE FINANCIAL INTEREST OF SELLER AND BUYER
          </div>
        ` : ''}
      `
    });
  }

  // Final page with contact info and CTA
  sections.push({
    id: 'final',
    content: `
      <div class="contact-info">
        <h2 class="financial-title">📞 Contact Information</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-label">Name/Company</div>
            <div class="contact-value">${data.contactName}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Phone</div>
            <div class="contact-value"><a href="tel:${data.contactPhone}">${data.contactPhone}</a></div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value"><a href="mailto:${data.contactEmail}">${data.contactEmail}</a></div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Business Hours</div>
            <div class="contact-value">${data.businessHours}</div>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <h2 class="cta-title">🚨 THIS DEAL WILL NOT LAST LONG</h2>
        <p class="cta-subtitle">PUT YOUR OFFER IN TODAY</p>
        
        <div class="closing-info">
          <div class="closing-grid">
            <div>
              <div class="contact-label">EMD Amount</div>
              <div class="contact-value">$${data.emdAmount.toLocaleString()}</div>
            </div>
            <div>
              <div class="contact-label">Closing Date</div>
              <div class="contact-value">${data.closingDate ? data.closingDate.toLocaleDateString() : 'TBD'}</div>
            </div>
          </div>
          <div class="emd-notice">
            EMD DUE WITHIN 24HR OF EXECUTED CONTRACT
          </div>
        </div>
      </div>
    `
  });
  
  // Create PDF with each section on separate pages
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Common CSS styles for all sections
  const commonStyles = `
    <style>
      * { box-sizing: border-box; }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 15mm 20mm;
        background: white;
        line-height: 1.4;
        color: #1f2937;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 30px;
        border-bottom: 3px solid #3b82f6;
      }
      
      .title {
        font-size: 32px;
        font-weight: 800;
        color: #1f2937;
        margin-bottom: 10px;
        line-height: 1.2;
      }
      
      .subtitle {
        font-size: 18px;
        color: #6b7280;
        margin-bottom: 20px;
      }
      
      .address {
        font-size: 24px;
        font-weight: 600;
        color: #dc2626;
        margin-bottom: 10px;
      }
      
      .financial-section {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 30px;
        border-radius: 12px;
        margin: 30px 0;
        text-align: center;
      }
      
      .financial-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
      }
      
      .financial-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .financial-item {
        background: rgba(255,255,255,0.15);
        padding: 15px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
      
      .financial-label {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 5px;
      }
      
      .financial-value {
        font-size: 18px;
        font-weight: 700;
      }
      
      .gross-profit {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin: 20px 0;
      }
      
      .gross-profit-value {
        font-size: 36px;
        font-weight: 800;
        margin: 10px 0;
      }
      
      .property-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin: 30px 0;
      }
      
      .property-item {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        border: 2px solid #e2e8f0;
      }
      
      .property-icon {
        font-size: 20px;
        margin-bottom: 8px;
      }
      
      .property-value {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 3px;
      }
      
      .property-label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .section {
        margin: 25px 0;
        padding: 20px;
        background: #f9fafb;
        border-radius: 12px;
        border-left: 4px solid #3b82f6;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .detail-item {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .comp-section {
        margin-bottom: 20px;
      }
      
      .comp-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 10px;
      }
      
      .comp-item {
        margin-bottom: 8px;
        font-size: 13px;
      }
      
      .comp-number {
        font-weight: 600;
        margin-right: 8px;
      }
      
      .comp-link {
        color: #3b82f6;
        text-decoration: underline;
        word-break: break-all;
      }
      
      .occupancy-section, .access-section {
        background: #f0f9ff;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
      }
      
      .occupancy-title, .access-title {
        font-size: 16px;
        font-weight: 600;
        color: #1d4ed8;
        margin-bottom: 8px;
      }
      
      .contact-info {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 30px;
        border-radius: 12px;
        margin-top: 30px;
      }
      
      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }
      
      .contact-item {
        background: rgba(255,255,255,0.15);
        padding: 12px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
      
      .contact-label {
        font-size: 12px;
        opacity: 0.9;
        margin-bottom: 4px;
      }
      
      .contact-value {
        font-size: 14px;
        font-weight: 600;
      }
      
      .contact-value a {
        color: white;
        text-decoration: underline;
      }
      
      .memo-alert {
        background: #fef3c7;
        border: 2px solid #f59e0b;
        color: #92400e;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        font-weight: 600;
        text-align: center;
        font-size: 14px;
      }
      
      .rental-backup {
        background: #ecfdf5;
        border: 2px solid #10b981;
        color: #065f46;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      
      .rental-backup-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #059669;
      }
      
      .photo-section {
        text-align: center;
        margin: 20px 0;
      }
      
      .photo-link {
        display: inline-block;
        background: #3b82f6;
        color: white;
        padding: 10px 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 8px;
        font-size: 14px;
      }
      
      .cta-section {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        margin-top: 30px;
      }
      
      .cta-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      
      .cta-subtitle {
        font-size: 14px;
        margin-bottom: 15px;
        opacity: 0.9;
      }
      
      .closing-info {
        background: rgba(255,255,255,0.15);
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        backdrop-filter: blur(10px);
      }
      
      .closing-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 10px;
      }
      
      .emd-notice {
        font-weight: 600;
        font-size: 13px;
        text-align: center;
      }
    </style>
  `;

  // Render each section separately
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    if (i > 0) {
      pdf.addPage();
    }

    // Create HTML for this section
    const sectionHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${commonStyles}
      </head>
      <body>
        ${section.content}
      </body>
      </html>
    `;

    // Create temporary div for this section
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    document.body.appendChild(tempDiv);

    try {
      // Generate canvas for this section
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight
      });

      // Calculate scaling to fit page width
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / (imgWidth / 2); // Divide by 2 because of scale factor
      const scaledHeight = (imgHeight / 2) * ratio;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);

    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  }

  // Download the PDF
  const fileName = `Fix-Flip-Flyer-${data.address.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
