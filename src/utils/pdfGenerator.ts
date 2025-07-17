
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
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessHours: string;
  emdAmount: number;
  closingDate: Date | undefined;
  memoFiled: boolean;
  exitStrategy: string;
  rentalBackup: boolean;
  rentalBackupDetails: string;
  photoLink: string;
}

export const generatePDF = async (data: PDFData): Promise<void> => {
  // Calculate derived values
  const totalInvestment = data.purchasePrice + data.rehabEstimate;
  const grossProfit = data.arv - totalInvestment;
  const sellingCostAmount = Math.round(data.arv * (data.sellingCosts / 100));
  const netProfit = grossProfit - sellingCostAmount;
  
  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Fix & Flip Opportunity</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .financial-item {
          background: rgba(255,255,255,0.15);
          padding: 15px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .financial-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        
        .financial-value {
          font-size: 20px;
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
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        
        .property-item {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #e2e8f0;
        }
        
        .property-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .property-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .property-label {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .section {
          margin: 30px 0;
          padding: 25px;
          background: #f9fafb;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .contact-item {
          background: rgba(255,255,255,0.15);
          padding: 15px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .contact-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        
        .contact-value {
          font-size: 16px;
          font-weight: 600;
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
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #059669;
        }
        
        .photo-section {
          text-align: center;
          margin: 30px 0;
        }
        
        .photo-link {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-top: 30px;
        }
        
        .cta-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .cta-subtitle {
          font-size: 16px;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        
        .closing-info {
          background: rgba(255,255,255,0.15);
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          backdrop-filter: blur(10px);
        }
        
        @media print {
          body {
            background: white;
            padding: 20px;
          }
          
          .container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">${data.title}</h1>
          <p class="subtitle">${data.subtitle}</p>
          <div class="address">📍 ${data.address}</div>
        </div>
        
        <div class="financial-section">
          <h2 class="financial-title">💰 Financial Breakdown</h2>
          <div class="financial-grid">
            <div class="financial-item">
              <div class="financial-label">Starting Price</div>
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
        
        ${data.exitStrategy ? `
          <div class="section">
            <h2 class="section-title">🔍 Property Details</h2>
            <p>${data.exitStrategy}</p>
          </div>
        ` : ''}
        
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
        
        <div class="contact-info">
          <h2 class="financial-title">📞 Contact Information</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <div class="contact-label">Name/Company</div>
              <div class="contact-value">${data.contactName}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Phone</div>
              <div class="contact-value">${data.contactPhone}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Email</div>
              <div class="contact-value">${data.contactEmail}</div>
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div class="contact-label">EMD Amount</div>
                <div class="contact-value">$${data.emdAmount.toLocaleString()}</div>
              </div>
              <div>
                <div class="contact-label">Closing Date</div>
                <div class="contact-value">${data.closingDate ? data.closingDate.toLocaleDateString() : 'TBD'}</div>
              </div>
            </div>
            <div style="margin-top: 15px; font-weight: 600;">
              EMD DUE WITHIN 24HR OF EXECUTED CONTRACT
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a new window with the HTML content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for the content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
};
