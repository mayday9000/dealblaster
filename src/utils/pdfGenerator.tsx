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

// PDF Styles - Redesigned to prevent breaks
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.3
  },
  
  // Header Section
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6'
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1
  },
  brandBlue: {
    color: '#3B82F6'
  },
  
  // Title Section - Keep together
  titleSection: {
    marginBottom: 15,
    break: false,
    minHeight: 60
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 1.2
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10
  },
  
  // Property Info Section - Keep together
  propertyInfoSection: {
    marginBottom: 15,
    break: false,
    minHeight: 80
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8
  },
  photoLinkContainer: {
    alignItems: 'center',
    marginBottom: 8
  },
  photoLink: {
    fontSize: 12,
    color: '#3B82F6',
    textDecoration: 'underline'
  },
  
  // Financial Section - Single block
  financialSection: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    break: false,
    minHeight: 120
  },
  financialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'white',
    textAlign: 'center'
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  financialItem: {
    flex: 1,
    marginHorizontal: 5
  },
  financialLabel: {
    fontSize: 10,
    marginBottom: 3,
    color: 'rgba(255,255,255,0.8)'
  },
  financialValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  
  // Property Overview - Compact grid
  propertyOverviewSection: {
    marginBottom: 15,
    break: false,
    minHeight: 100
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  propertyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  propertyGridItem: {
    width: '30%',
    marginBottom: 8,
    alignItems: 'center'
  },
  propertyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center'
  },
  
  // Property Details - Compact format
  detailsSection: {
    marginBottom: 15,
    break: false,
    minHeight: 120
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  systemDetail: {
    width: '48%',
    marginBottom: 8
  },
  systemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3
  },
  systemInfo: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.2
  },
  
  // Comps Section - Organized by type
  compsSection: {
    marginBottom: 15,
    break: false,
    minHeight: 100
  },
  compTypeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 5,
    marginTop: 8
  },
  compItem: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 3,
    paddingLeft: 10
  },
  
  // Occupancy & Access - Compact
  infoSection: {
    marginBottom: 15,
    break: false,
    minHeight: 60
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoColumn: {
    width: '48%'
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5
  },
  infoText: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.3
  },
  
  // Contact Section
  contactSection: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    break: false,
    minHeight: 80
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center'
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  contactItem: {
    width: '48%',
    marginBottom: 5
  },
  contactLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2
  },
  contactValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white'
  },
  
  // EMD Section
  emdSection: {
    backgroundColor: '#DC2626',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    break: false,
    minHeight: 60
  },
  emdTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  emdInfo: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 3
  },
  
  // Warning Section
  warningSection: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 10,
    marginBottom: 15,
    break: false
  },
  warningText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  
  // General text
  bodyText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.3,
    marginBottom: 3
  },
  
  // Checkbox simulation
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#6B7280',
    marginRight: 5,
    backgroundColor: '#FFFFFF'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  }
});

// PDF Document Component
const PDFDocument: React.FC<{ data: PDFData }> = ({ data }) => {
  // Helper function to format financial values
  const formatCurrency = (value: string) => {
    if (!value || value.trim() === '') return 'TBD';
    if (value.includes('$')) return value;
    return `$${value}`;
  };

  // Helper function to get age display
  const getAgeDisplay = (specificAge: string, generalAge: string) => {
    if (specificAge && specificAge.trim()) return specificAge;
    if (generalAge && generalAge.trim()) return generalAge;
    return 'Unknown';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>
            DEAL<Text style={styles.brandBlue}>BLASTER</Text>
          </Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            💸 ({data.city}) {data.selectedTitle || data.title}
          </Text>
          {data.hook && (
            <Text style={styles.subtitle}>
              📍 {data.hook}
            </Text>
          )}
        </View>

        {/* Property Address & Photo */}
        <View style={styles.propertyInfoSection}>
          <Text style={styles.address}>
            📍 {data.address}
          </Text>
          {data.photoLink && data.photoLink.trim() && (
            <View style={styles.photoLinkContainer}>
              <Text style={styles.photoLink}>
                📸 Photo Link: Click Here
              </Text>
            </View>
          )}
        </View>

        {/* Financial Breakdown */}
        {data.includeFinancialBreakdown && (
          <View style={styles.financialSection}>
            <Text style={styles.financialTitle}>💰 Financial Breakdown</Text>
            <View style={styles.financialRow}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Purchase Price:</Text>
                <Text style={styles.financialValue}>{formatCurrency(data.askingPrice)}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>🔧 Estimated Rehab:</Text>
                <Text style={styles.financialValue}>{formatCurrency(data.rehabEstimate)}</Text>
              </View>
            </View>
            <View style={styles.financialRow}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>🏡 After Repair Value (ARV):</Text>
                <Text style={styles.financialValue}>{formatCurrency(data.arv)}</Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>💵 Gross Profit:</Text>
                <Text style={styles.financialValue}>{formatCurrency(data.grossProfit)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Property Overview */}
        <View style={styles.propertyOverviewSection}>
          <Text style={styles.sectionTitle}>🏠 Property Overview</Text>
          <View style={styles.propertyGrid}>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>🛏 {data.bedrooms || 'TBD'} Bedrooms</Text>
            </View>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>🛁 {data.bathrooms || 'TBD'} Bathrooms</Text>
            </View>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>📐 {data.squareFootage || 'TBD'} Sq Ft</Text>
            </View>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>📏 {data.lotSize || 'TBD'} Lot</Text>
            </View>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>📚 {data.zoning || 'TBD'} Zoning</Text>
            </View>
            <View style={styles.propertyGridItem}>
              <Text style={styles.propertyValue}>🏗️ Built: {data.yearBuilt || 'TBD'}</Text>
            </View>
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>🔍 Property Details</Text>
          <View style={styles.detailsGrid}>
            {/* Roof */}
            <View style={styles.systemDetail}>
              <Text style={styles.systemTitle}>🏠 Roof:</Text>
              <Text style={styles.systemInfo}>
                Age: {getAgeDisplay(data.roofSpecificAge, data.roofAge)}
              </Text>
              <Text style={styles.systemInfo}>
                Condition: {data.roofCondition || 'Unknown'}
              </Text>
              {data.roofLastServiced && (
                <Text style={styles.systemInfo}>Last Serviced: {data.roofLastServiced}</Text>
              )}
            </View>

            {/* HVAC */}
            <View style={styles.systemDetail}>
              <Text style={styles.systemTitle}>❄️ HVAC:</Text>
              <Text style={styles.systemInfo}>
                Age: {getAgeDisplay(data.hvacSpecificAge, data.hvacAge)}
              </Text>
              <Text style={styles.systemInfo}>
                Condition: {data.hvacCondition || 'Unknown'}
              </Text>
              {data.hvacLastServiced && (
                <Text style={styles.systemInfo}>Last Serviced: {data.hvacLastServiced}</Text>
              )}
            </View>

            {/* Water Heater */}
            <View style={styles.systemDetail}>
              <Text style={styles.systemTitle}>🚿 Hot Water Heater:</Text>
              <Text style={styles.systemInfo}>
                Age: {getAgeDisplay(data.waterHeaterSpecificAge, data.waterHeaterAge)}
              </Text>
              <Text style={styles.systemInfo}>
                Condition: {data.waterHeaterCondition || 'Unknown'}
              </Text>
              {data.waterHeaterLastServiced && (
                <Text style={styles.systemInfo}>Last Serviced: {data.waterHeaterLastServiced}</Text>
              )}
            </View>

            {/* Foundation */}
            {data.foundationType && (
              <View style={styles.systemDetail}>
                <Text style={styles.systemTitle}>🏗️ Foundation:</Text>
                <Text style={styles.systemInfo}>Type: {data.foundationType}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Comps */}
        {data.comps.some(comp => comp.address.trim()) && (
          <View style={styles.compsSection}>
            <Text style={styles.sectionTitle}>📊 Comps</Text>
            
            {/* Group and display comps by type */}
            {['Flip Comp', 'Cash Comp', 'Pending', 'Active'].map(compType => {
              const filteredComps = data.comps.filter(comp => comp.compType === compType && comp.address.trim());
              if (filteredComps.length === 0) return null;
              
              return (
                <View key={compType}>
                  <Text style={styles.compTypeTitle}>
                    {compType === 'Flip Comp' ? 'Sold Flipped Comps:' : 
                     compType === 'Cash Comp' ? 'Sold As-Is Comps:' :
                     compType === 'Pending' ? 'Pending Flipped Comps:' : 
                     'Active Comps:'}
                  </Text>
                  {filteredComps.map((comp, index) => (
                    <Text key={index} style={styles.compItem}>
                      {index + 1}. {comp.address} - {comp.bedrooms}br/{comp.bathrooms}ba - {comp.squareFootage} sqft
                      {comp.conditionLabel && ` - ${comp.conditionLabel}`}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Occupancy & Access */}
        <View style={styles.infoSection}>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoTitle}>🏡 Occupancy</Text>
              <Text style={styles.infoText}>Current: {data.currentOccupancy || 'Unknown'}</Text>
              <Text style={styles.infoText}>At Closing: {data.closingOccupancy || 'Unknown'}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoTitle}>🔐 Access</Text>
              <Text style={styles.infoText}>Contact for showing details</Text>
            </View>
          </View>
        </View>

        {/* Memo Warning */}
        {data.memoFiled && (
          <View style={styles.warningSection}>
            <Text style={styles.warningText}>
              ☐ Memorandum Filed - Legal interest protected
            </Text>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>📞 Contact Info</Text>
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Name / Company:</Text>
              <Text style={styles.contactValue}>{data.contactName || 'Contact Us'}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>{data.contactPhone || 'TBD'}</Text>
            </View>
            {data.contactEmail && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text style={styles.contactValue}>{data.contactEmail}</Text>
              </View>
            )}
            {data.businessHours && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Business Hours:</Text>
                <Text style={styles.contactValue}>{data.businessHours}</Text>
              </View>
            )}
          </View>
        </View>

        {/* EMD Info */}
        <View style={styles.emdSection}>
          <Text style={styles.emdTitle}>💵 EMD Info</Text>
          {data.emdAmount && (
            <Text style={styles.emdInfo}>Amount Due: {formatCurrency(data.emdAmount)}</Text>
          )}
          {data.emdDueDate && (
            <Text style={styles.emdInfo}>Due Date: {data.emdDueDate}</Text>
          )}
          <Text style={styles.emdInfo}>THIS DEAL WILL NOT LAST LONG - PUT YOUR OFFER IN TODAY</Text>
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
