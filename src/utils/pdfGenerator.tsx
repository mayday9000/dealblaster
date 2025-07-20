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
  address: string;
  beds: number | undefined;
  baths: number | undefined;
  sqft: number | undefined;
  yearBuilt: number | undefined;
  lotSize: number | undefined;
  zoning: string;
  purchasePrice: number | undefined;
  rehabEstimate: number | undefined;
  arv: number | undefined;
  sellingCosts: number | undefined;
  netProfit: number | undefined;
  includeFinancialBreakdown?: boolean;
  
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
  contactImage: string | null; // Base64 data URL
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

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica'
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 1.2,
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 15,
    textAlign: 'center',
    wordWrap: 'break-word',
    hyphens: 'none'
  },
  address: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    wordWrap: 'break-word',
    hyphens: 'none'
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
  // Calculate derived values - only if financial data is included
  const totalInvestment = (data.purchasePrice || 0) + (data.rehabEstimate || 0);
  const grossProfit = (data.arv || 0) - totalInvestment;
  const sellingCostAmount = Math.round((data.arv || 0) * ((data.sellingCosts || 0) / 100));
  
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.subtitle}>{data.subtitle}</Text>
          <Text style={styles.address}>{data.address}</Text>
        </View>

        {/* Financial Section - Only show if included */}
        {data.includeFinancialBreakdown && (
          <View style={styles.financialSection}>
            <Text style={styles.financialTitle}>Financial Breakdown</Text>
            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Purchase Price</Text>
                <Text style={styles.financialValue}>${(data.purchasePrice || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Rehab Estimate</Text>
                <Text style={styles.financialValue}>${(data.rehabEstimate || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Total Investment</Text>
                <Text style={styles.financialValue}>${totalInvestment.toLocaleString()}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>After Repair Value</Text>
                <Text style={styles.financialValue}>${(data.arv || 0).toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.grossProfit}>
              <Text style={styles.financialLabel}>Gross Profit</Text>
              <Text style={styles.grossProfitValue}>${grossProfit.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Property Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <View style={styles.propertyGrid}>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.beds || 'TBD'}</Text>
              <Text style={styles.propertyLabel}>Bedrooms</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.baths || 'TBD'}</Text>
              <Text style={styles.propertyLabel}>Bathrooms</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.sqft ? data.sqft.toLocaleString() : 'TBD'}</Text>
              <Text style={styles.propertyLabel}>Square Feet</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.lotSize || 'TBD'}</Text>
              <Text style={styles.propertyLabel}>Acre Lot</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.yearBuilt || 'TBD'}</Text>
              <Text style={styles.propertyLabel}>Year Built</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyValue}>{data.zoning}</Text>
              <Text style={styles.propertyLabel}>Zoning</Text>
            </View>
          </View>
        </View>

        {/* Photo Link - Only if exists */}
        {data.photoLink && data.photoLink.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Photos</Text>
            <Text style={styles.text}>Click Here to View Photos: {data.photoLink}</Text>
          </View>
        )}

        {/* Property Details */}
        {(data.roofAge || data.roofCondition || data.roofNotes || 
          data.hvacAge || data.hvacCondition || data.hvacNotes ||
          data.waterHeaterAge || data.waterHeaterCondition || data.waterHeaterNotes ||
          data.sidingType || data.sidingCondition || data.sidingNotes ||
          data.additionalNotes) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            {(data.roofAge || data.roofCondition || data.roofNotes) && (
              <View style={styles.detailItem}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Roof: </Text>
                  {data.roofAge && `Age: ${data.roofAge} `}
                  {data.roofCondition && `| Condition: ${data.roofCondition}`}
                </Text>
                {data.roofNotes && <Text style={styles.text}>   {data.roofNotes}</Text>}
              </View>
            )}
            {(data.hvacAge || data.hvacCondition || data.hvacNotes) && (
              <View style={styles.detailItem}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>HVAC: </Text>
                  {data.hvacAge && `Age: ${data.hvacAge} `}
                  {data.hvacCondition && `| Condition: ${data.hvacCondition}`}
                </Text>
                {data.hvacNotes && <Text style={styles.text}>   {data.hvacNotes}</Text>}
              </View>
            )}
            {(data.waterHeaterAge || data.waterHeaterCondition || data.waterHeaterNotes) && (
              <View style={styles.detailItem}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Hot Water Heater: </Text>
                  {data.waterHeaterAge && `Age: ${data.waterHeaterAge} `}
                  {data.waterHeaterCondition && `| Condition: ${data.waterHeaterCondition}`}
                </Text>
                {data.waterHeaterNotes && <Text style={styles.text}>   {data.waterHeaterNotes}</Text>}
              </View>
            )}
            {(data.sidingType || data.sidingCondition || data.sidingNotes) && (
              <View style={styles.detailItem}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Siding: </Text>
                  {data.sidingType && `Type: ${data.sidingType} `}
                  {data.sidingCondition && `| Condition: ${data.sidingCondition}`}
                </Text>
                {data.sidingNotes && <Text style={styles.text}>   {data.sidingNotes}</Text>}
              </View>
            )}
            {data.additionalNotes && (
              <View style={styles.detailItem}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: 'bold' }}>Additional Notes: </Text>
                  {data.additionalNotes}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Exit Strategy */}
        {data.exitStrategy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exit Strategy Notes</Text>
            <Text style={styles.text}>{data.exitStrategy}</Text>
          </View>
        )}

        {/* Comps - All comp types in one unified section */}
        {[data.pendingComps, data.soldComps, data.rentalComps, data.newConstructionComps, data.asIsComps]
          .some(comps => comps.some(comp => comp.trim())) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comps</Text>
            
            {data.pendingComps.some(comp => comp.trim()) && (
              <View style={styles.compSection}>
                <Text style={styles.compTitle}>Pending Flipped Comps</Text>
                {data.pendingComps.filter(comp => comp.trim()).map((comp, index) => (
                  <Text key={index} style={styles.compItem}>{index + 1}. {comp}</Text>
                ))}
              </View>
            )}
            
            {data.soldComps.some(comp => comp.trim()) && (
              <View style={styles.compSection}>
                <Text style={styles.compTitle}>Sold Flipped Comps</Text>
                {data.soldComps.filter(comp => comp.trim()).map((comp, index) => (
                  <Text key={index} style={styles.compItem}>{index + 1}. {comp}</Text>
                ))}
              </View>
            )}
            
            {data.rentalComps.some(comp => comp.trim()) && (
              <View style={styles.compSection}>
                <Text style={styles.compTitle}>Rental Comps</Text>
                {data.rentalComps.filter(comp => comp.trim()).map((comp, index) => (
                  <Text key={index} style={styles.compItem}>{index + 1}. {comp}</Text>
                ))}
              </View>
            )}
            
            {data.newConstructionComps.some(comp => comp.trim()) && (
              <View style={styles.compSection}>
                <Text style={styles.compTitle}>New Construction Comps</Text>
                {data.newConstructionComps.filter(comp => comp.trim()).map((comp, index) => (
                  <Text key={index} style={styles.compItem}>{index + 1}. {comp}</Text>
                ))}
              </View>
            )}
            
            {data.asIsComps.some(comp => comp.trim()) && (
              <View style={styles.compSection}>
                <Text style={styles.compTitle}>Sold As-Is Comps</Text>
                {data.asIsComps.filter(comp => comp.trim()).map((comp, index) => (
                  <Text key={index} style={styles.compItem}>{index + 1}. {comp}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Occupancy */}
        {data.occupancy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Occupancy</Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>
                {data.occupancy.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </Text>
            {data.leaseTerms && (
              <Text style={styles.text}>Lease Terms: {data.leaseTerms}</Text>
            )}
          </View>
        )}

        {/* Access */}
        {data.access && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Access</Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>
                {data.access.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </Text>
            {data.lockboxCode && (
              <Text style={styles.text}>Lockbox Code: {data.lockboxCode}</Text>
            )}
          </View>
        )}

        {/* Rental Backup */}
        {data.rentalBackup && (
          <View style={[styles.section, { backgroundColor: '#ECFDF5', borderLeftColor: '#10B981' }]}>
            <Text style={[styles.sectionTitle, { color: '#059669' }]}>Bonus: Rental Backup Plan</Text>
            <Text style={styles.text}>{data.rentalBackupDetails}</Text>
          </View>
        )}

        {/* Memo Alert */}
        {data.memoFiled && (
          <View style={[styles.section, { backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' }]}>
            <Text style={[styles.text, { fontWeight: 'bold', textAlign: 'center', color: '#92400E' }]}>
              WARNING: MEMORANDUM OF CONTRACT FILED ON THIS PROPERTY TO PROTECT THE FINANCIAL INTEREST OF SELLER AND BUYER
            </Text>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.financialTitle}>Contact Information</Text>
          
          {/* Profile Image */}
          {data.contactImage && (
            <View style={styles.contactImageContainer}>
              <Image style={styles.contactImage} src={data.contactImage} />
            </View>
          )}
          
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Name/Company</Text>
              <Text style={styles.contactValue}>{data.contactName}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{data.contactPhone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{data.contactEmail}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Business Hours</Text>
              <Text style={styles.contactValue}>{data.businessHours}</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>THIS DEAL WILL NOT LAST LONG</Text>
          <Text style={styles.text}>PUT YOUR OFFER IN TODAY</Text>
          
          <View style={[styles.financialGrid, { marginTop: 15 }]}>
            <View style={styles.financialItem}>
              <Text style={styles.contactLabel}>EMD Amount</Text>
              <Text style={styles.contactValue}>${data.emdAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.contactLabel}>Closing Date</Text>
              <Text style={styles.contactValue}>{data.closingDate ? data.closingDate.toLocaleDateString() : 'TBD'}</Text>
            </View>
          </View>
          
          <Text style={[styles.text, { fontWeight: 'bold', textAlign: 'center', marginTop: 10 }]}>
            EMD DUE WITHIN 24HR OF EXECUTED CONTRACT
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const generatePDF = async (data: PDFData): Promise<void> => {
  try {
    // Generate PDF blob
    const blob = await pdf(<PDFDocument data={data} />).toBlob();
    
    // Create download link
    const fileName = `Fix-Flip-Flyer-${data.address.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};