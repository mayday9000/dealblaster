import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink,
  pdf,
  Image
} from '@react-pdf/renderer';
import React from 'react';

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

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica'
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 15,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1
  },
  brandBlue: {
    color: '#3B82F6'
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.3,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed'
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  addressSection: {
    alignItems: 'center',
    marginBottom: 15
  },
  address: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 5,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  photoLink: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 5
  },
  closingDate: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    orphans: 2,
    widows: 2,
    minHeight: 40
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    orphans: 2,
    widows: 2
  },
  financialSection: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
    orphans: 2,
    widows: 2
  },
  financialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white'
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  financialItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 6,
    minWidth: '22%',
    marginBottom: 8
  },
  financialLabel: {
    fontSize: 11,
    marginBottom: 4,
    color: 'white'
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  grossProfit: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  grossProfitValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  propertyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  propertyItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: '15%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2
  },
  propertyLabel: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase'
  },
  detailItem: {
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 1.4,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  contactSection: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    orphans: 2,
    widows: 2
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10
  },
  contactItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 6,
    minWidth: '22%',
    marginBottom: 8
  },
  contactLabel: {
    fontSize: 10,
    marginBottom: 3,
    color: 'white'
  },
  contactValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white'
  },
  contactImageContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8
  },
  ctaSection: {
    backgroundColor: '#DC2626',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    orphans: 2,
    widows: 2
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    lineHeight: 1.4,
    marginBottom: 4,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  compSection: {
    marginBottom: 15,
    orphans: 2,
    widows: 2
  },
  compTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937'
  },
  compItem: {
    fontSize: 11,
    marginBottom: 4,
    color: '#3B82F6',
    wordWrap: 'break-word',
    hyphens: 'none'
  }
});

// PDF Document Component
const PDFDocument: React.FC<{ data: PDFData }> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* DealBlaster Brand Header */}
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>
            DEAL<Text style={styles.brandBlue}>BLASTER</Text>
          </Text>
        </View>

        {/* Property Title with House Emoji */}
        <Text style={styles.propertyTitle}>
          🏠 {data.selectedTitle || data.title}
        </Text>

        {/* Property Image Placeholder */}
        <View style={styles.propertyImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Property Photo</Text>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <Text style={styles.address}>📍 {data.address}</Text>
          {data.photoLink && data.photoLink.trim() && (
            <Text style={styles.photoLink}>📷 Photos: Click Here</Text>
          )}
          <Text style={styles.closingDate}>
            📅 Closing: {data.closingDate}
          </Text>
        </View>

        {/* Financial Section - Only show if included */}
        {data.includeFinancialBreakdown && (
          <View style={styles.financialSection} break={false}>
            <Text style={styles.financialTitle}>Financial Breakdown</Text>
            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>ARV</Text>
                <Text style={styles.financialValue}>{data.arv || 'TBD'}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Rehab Estimate</Text>
                <Text style={styles.financialValue}>{data.rehabEstimate || 'TBD'}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>All-In Cost</Text>
                <Text style={styles.financialValue}>{data.allIn || 'TBD'}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Gross Profit</Text>
                <Text style={styles.financialValue}>{data.grossProfit || 'TBD'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Property Overview */}
        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <View style={styles.propertyGrid}>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>🛏️ {data.bedrooms || 'TBD'} Bed</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>🛁 {data.bathrooms || 'TBD'} Bath</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>📐 {data.squareFootage || 'TBD'} Sq Ft</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>🔨 Built: {data.yearBuilt || 'TBD'}</Text>
            </View>
            {data.foundationType && (
              <View style={styles.propertyItem}>
                <Text style={styles.propertyValue}>🏗️ {data.foundationType}</Text>
              </View>
            )}
            {data.lotSize && (
              <View style={styles.propertyItem}>
                <Text style={styles.propertyValue}>🌳 {data.lotSize} Lot</Text>
              </View>
            )}
            {data.zoning && (
              <View style={styles.propertyItem}>
                <Text style={styles.propertyValue}>🚫 No HOA</Text>
              </View>
            )}
            {data.utilities.length > 0 && data.utilities.includes('Well & Septic') && (
              <View style={styles.propertyItem}>
                <Text style={styles.propertyValue}>💧 Well & Septic</Text>
              </View>
            )}
          </View>
          
          {/* Additional property details */}
          {(data.garage || data.pool) && (
            <View style={{ marginTop: 10 }}>
              {data.garage && (
                <Text style={styles.text}>🚗 Garage: {data.garage}</Text>
              )}
              {data.pool && (
                <Text style={styles.text}>🏊 Pool: Yes</Text>
              )}
            </View>
          )}
        </View>

        {/* Condition Section */}
        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <Text style={styles.text}>
            🏠 {data.hook || 'Very light lipstick rehab - cosmetics only. Delivered vacant with solid bones, on a full acre with no HOA. Great opportunity!'}
          </Text>
        </View>

        {/* Property Details */}
        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          {/* Roof */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>🏠 Roof: </Text>
              {data.roofSpecificAge || data.roofAge || '10-15 Years Old'} {data.roofCondition ? `- ${data.roofCondition}` : ''}
              {data.roofLastServiced && ` | Last Serviced: ${data.roofLastServiced}`}
            </Text>
          </View>
          
          {/* HVAC */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>❄️ HVAC: </Text>
              {data.hvacSpecificAge || data.hvacAge || 'Unknown'} {data.hvacCondition ? `- ${data.hvacCondition}` : ''}
              {data.hvacLastServiced && ` | Last Serviced: ${data.hvacLastServiced}`}
            </Text>
          </View>
          
          {/* Water Heater */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>🚿 Water Heater: </Text>
              {data.waterHeaterSpecificAge || data.waterHeaterAge || 'Unknown'} {data.waterHeaterCondition ? `- ${data.waterHeaterCondition}` : ''}
              {data.waterHeaterLastServiced && ` | Last Serviced: ${data.waterHeaterLastServiced}`}
            </Text>
          </View>
        </View>

        {/* Exit Strategy */}
        {data.exitStrategy && (
          <View style={styles.section} break={false}>
            <Text style={styles.sectionTitle}>Exit Strategy Notes</Text>
            <Text style={styles.text}>{data.exitStrategy}</Text>
          </View>
        )}

        {/* Comps */}
        {data.comps.some(comp => comp.address.trim()) && (
          <View style={styles.section} break={false}>
            <Text style={styles.sectionTitle}>Comps</Text>
            
            {/* Group comps by type */}
            {['Flip Comp', 'Cash Comp', 'Pending', 'Active'].map(compType => {
              const filteredComps = data.comps.filter(comp => comp.compType === compType && comp.address.trim());
              if (filteredComps.length === 0) return null;
              
              return (
                <View key={compType} style={styles.compSection}>
                  <Text style={styles.compTitle}>{compType}s</Text>
                  {filteredComps.map((comp, index) => (
                    <Text key={index} style={styles.compItem}>
                      {index + 1}. {comp.address} - {comp.bedrooms}br/{comp.bathrooms}ba - {comp.squareFootage} sqft
                      {comp.conditionLabel && ` - ${comp.conditionLabel}`}
                      {comp.zillowLink && ` - Link: ${comp.zillowLink}`}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Occupancy */}
        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>Occupancy</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Current: </Text>
            {data.currentOccupancy || 'Unknown'}
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>At Closing: </Text>
            {data.closingOccupancy || 'Unknown'}
          </Text>
        </View>

        {/* Memo Alert */}
        {data.memoFiled && (
          <View style={[styles.section, { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' }]} break={false}>
            <Text style={[styles.text, { fontWeight: 'bold', textAlign: 'center', color: '#92400E' }]}>
              WARNING: MEMORANDUM OF CONTRACT FILED ON THIS PROPERTY TO PROTECT THE FINANCIAL INTEREST OF SELLER AND BUYER
            </Text>
          </View>
        )}

        {/* Additional Disclosures */}
        {(data.postPossession || data.additionalDisclosures) && (
          <View style={styles.section} break={false}>
            <Text style={styles.sectionTitle}>Additional Disclosures</Text>
            {data.postPossession && (
              <Text style={styles.text}>• Post-possession disclosure applies</Text>
            )}
            {data.additionalDisclosures && (
              <Text style={styles.text}>{data.additionalDisclosures}</Text>
            )}
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactSection} break={false}>
          <Text style={styles.financialTitle}>Contact Information</Text>
          
          {/* Profile Image */}
          {data.contactImage && (
            <View style={styles.contactImageContainer}>
              <Image style={styles.contactImage} src={data.contactImage} />
            </View>
          )}
          
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Name</Text>
              <Text style={styles.contactValue}>{data.contactName || 'Contact Us'}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{data.contactPhone || 'TBD'}</Text>
            </View>
            {data.contactEmail && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{data.contactEmail}</Text>
              </View>
            )}
            {data.businessHours && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Hours</Text>
                <Text style={styles.contactValue}>{data.businessHours}</Text>
              </View>
            )}
            {data.officeNumber && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Office</Text>
                <Text style={styles.contactValue}>{data.officeNumber}</Text>
              </View>
            )}
            {data.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{data.website}</Text>
              </View>
            )}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection} break={false}>
          <Text style={styles.ctaTitle}>THIS DEAL WILL NOT LAST LONG</Text>
          <Text style={styles.text}>PUT YOUR OFFER IN TODAY</Text>
          
          {data.emdAmount && (
            <Text style={styles.text}>EMD: {data.emdAmount}</Text>
          )}
          {data.emdDueDate && (
            <Text style={styles.text}>EMD Due: {data.emdDueDate}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

// Export the generate PDF function
export const generatePDF = async (data: PDFData) => {
  const blob = await pdf(<PDFDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.city || 'Property'}_${data.dealType || 'Investment'}_Flyer.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  URL.revokeObjectURL(url);
};