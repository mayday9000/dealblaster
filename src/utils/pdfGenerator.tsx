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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  brandLogo: {
    width: 40,
    height: 40,
    backgroundColor: '#F97316',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  brandBlue: {
    color: '#2563EB'
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 1.3,
    wordWrap: 'break-word',
    hyphens: 'none',
    paddingHorizontal: 10
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 20,
    minHeight: 200
  },
  imagePlaceholder: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  photoLink: {
    fontSize: 12,
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 8
  },
  closingInfo: {
    fontSize: 14,
    color: '#374151',
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
  propertyOverviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center'
  },
  propertyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  propertyItem: {
    alignItems: 'center',
    minWidth: '18%',
    marginBottom: 15
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'center'
  },
  propertyLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center'
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
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.brandLogo}>
            <Text style={{ fontSize: 20, color: 'white' }}>📦</Text>
          </View>
          <Text style={styles.brandText}>
            DEAL<Text style={styles.brandBlue}>BLASTER</Text>
          </Text>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>
          🏠 {data.selectedTitle || data.title}
        </Text>

        {/* Property Image Placeholder */}
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>
            Property Photo
          </Text>
          <Text style={styles.imagePlaceholder}>
            [Photo will be displayed here]
          </Text>
        </View>

        {/* Property Address */}
        <Text style={styles.address}>
          📍 {data.address}
        </Text>

        {/* Photo Link */}
        {data.photoLink && (
          <Text style={styles.photoLink}>
            📷 Photos: Click Here
          </Text>
        )}

        {/* Closing Info */}
        <Text style={styles.closingInfo}>
          🗓 Closing: {data.closingDate}
        </Text>

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
        <View break={false}>
          <Text style={styles.propertyOverviewTitle}>Property Overview</Text>
          <View style={styles.propertyGrid}>
            <View style={styles.propertyItem}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>🛏️</Text>
              </View>
              <Text style={styles.propertyValue}>{data.bedrooms || 'TBD'} Bed</Text>
              <Text style={styles.propertyLabel}></Text>
            </View>
            <View style={styles.propertyItem}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>🏠</Text>
              </View>
              <Text style={styles.propertyValue}>{data.bathrooms || 'TBD'} Bath</Text>
              <Text style={styles.propertyLabel}></Text>
            </View>
            <View style={styles.propertyItem}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>📐</Text>
              </View>
              <Text style={styles.propertyValue}>{data.squareFootage || 'TBD'} Sq Ft</Text>
              <Text style={styles.propertyLabel}></Text>
            </View>
            <View style={styles.propertyItem}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>🏗️</Text>
              </View>
              <Text style={styles.propertyValue}>Built: {data.yearBuilt || 'TBD'}</Text>
              <Text style={styles.propertyLabel}></Text>
            </View>
            <View style={styles.propertyItem}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>🏘️</Text>
              </View>
              <Text style={styles.propertyValue}>{data.foundationType || 'Crawl Space'}</Text>
              <Text style={styles.propertyLabel}></Text>
            </View>
          </View>

          {/* Additional details in a compact format */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            marginBottom: 20,
            paddingHorizontal: 10
          }}>
            {data.lotSize && (
              <Text style={{ fontSize: 12, color: '#059669', marginBottom: 5 }}>
                🌿 {data.lotSize} Lot
              </Text>
            )}
            <Text style={{ fontSize: 12, color: '#DC2626', marginBottom: 5 }}>
              🚫 No HOA
            </Text>
            <Text style={{ fontSize: 12, color: '#0284C7', marginBottom: 5 }}>
              ❄️ {data.hvacCondition || 'Good'}: {data.hvacAge || '10-15'} Years Old
            </Text>
            <Text style={{ fontSize: 12, color: '#1D4ED8', marginBottom: 5 }}>
              💧 Well & Septic
            </Text>
            <Text style={{ fontSize: 12, color: '#8B5CF6', marginBottom: 5 }}>
              🏠 Roof: {data.roofAge || '10-15'} Years Old
            </Text>
          </View>
        </View>

        {/* Photo Link - Only if exists */}
        {data.photoLink && data.photoLink.trim() && (
          <View style={styles.section} break={false}>
            <Text style={styles.sectionTitle}>Property Photos</Text>
            <Text style={styles.text}>Click Here to View Photos: {data.photoLink}</Text>
          </View>
        )}

        {/* Property Details */}
        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          {/* Roof */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Roof: </Text>
              Age: {data.roofSpecificAge || data.roofAge || 'Unknown'} | Condition: {data.roofCondition || 'Unknown'}
              {data.roofLastServiced && ` | Last Serviced: ${data.roofLastServiced}`}
            </Text>
          </View>
          
          {/* HVAC */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>HVAC: </Text>
              Age: {data.hvacSpecificAge || data.hvacAge || 'Unknown'} | Condition: {data.hvacCondition || 'Unknown'}
              {data.hvacLastServiced && ` | Last Serviced: ${data.hvacLastServiced}`}
            </Text>
          </View>
          
          {/* Water Heater */}
          <View style={styles.detailItem}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Water Heater: </Text>
              Age: {data.waterHeaterSpecificAge || data.waterHeaterAge || 'Unknown'} | Condition: {data.waterHeaterCondition || 'Unknown'}
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