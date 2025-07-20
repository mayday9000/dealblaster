/**
 * PDF-optimized section components that render content for PDF generation.
 * Each section is styled for clean PDF rendering with proper typography and spacing.
 */
import React, { forwardRef } from 'react';
import { formatCurrency, formatNumber, calculateFinancials } from '@/lib/pdf/utils';

interface FormData {
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
  pendingComps: string[];
  soldComps: string[];
  rentalComps: string[];
  newConstructionComps: string[];
  asIsComps: string[];
  occupancy: string;
  leaseTerms: string;
  access: string;
  lockboxCode: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessHours: string;
  emdAmount: number;
  emdDueDate: string;
  memoFiled: boolean;
  photoLink: string;
  exitStrategy: string;
  rentalBackup: boolean;
  rentalBackupDetails: string;
  closingDate: Date | undefined;
}

interface PDFSectionProps {
  formData: FormData;
}

// Header Section
export const HeaderSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const { grossProfit } = calculateFinancials({
      purchasePrice: formData.purchasePrice,
      rehabEstimate: formData.rehabEstimate,
      arv: formData.arv,
      sellingCosts: formData.sellingCosts,
    });

    const city = formData.address.split(',')[1]?.trim() || 'Prime Location';
    const title = `🏠 ${city} Fix & Flip - ${formatCurrency(grossProfit)} Profit Potential`;

    return (
      <div ref={ref} data-pdf-section="header" className="bg-white p-8">
        <div className="text-center border-b-4 border-blue-500 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-xl text-gray-600 mb-4">Investment Property Analysis</p>
          <div className="text-2xl font-semibold text-red-600">📍 {formData.address}</div>
          {formData.photoLink && (
            <div className="mt-4">
              <a href={formData.photoLink} className="text-blue-600 underline">
                📸 View Property Photos
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Financial Breakdown Section
export const FinancialSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const { totalInvestment, grossProfit, sellingCostAmount, netProfit } = calculateFinancials({
      purchasePrice: formData.purchasePrice,
      rehabEstimate: formData.rehabEstimate,
      arv: formData.arv,
      sellingCosts: formData.sellingCosts,
    });

    return (
      <div ref={ref} data-pdf-section="financial" className="bg-white p-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">💰 Financial Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded text-center">
              <div className="text-sm opacity-90">Purchase Price</div>
              <div className="text-lg font-bold">{formatCurrency(formData.purchasePrice)}</div>
            </div>
            <div className="bg-white/20 p-3 rounded text-center">
              <div className="text-sm opacity-90">Rehab Estimate</div>
              <div className="text-lg font-bold">{formatCurrency(formData.rehabEstimate)}</div>
            </div>
            <div className="bg-white/20 p-3 rounded text-center">
              <div className="text-sm opacity-90">ARV</div>
              <div className="text-lg font-bold">{formatCurrency(formData.arv)}</div>
            </div>
            <div className="bg-white/20 p-3 rounded text-center">
              <div className="text-sm opacity-90">Selling Costs ({formData.sellingCosts}%)</div>
              <div className="text-lg font-bold">{formatCurrency(sellingCostAmount)}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg text-center">
            <div className="text-lg">Gross Profit Potential</div>
            <div className="text-3xl font-bold">{formatCurrency(grossProfit)}</div>
          </div>
        </div>
      </div>
    );
  }
);

// Property Overview Section
export const PropertyOverviewSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => (
    <div ref={ref} data-pdf-section="propertyOverview" className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
        🏡 Property Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
          <div className="text-xl mb-2">🛏️</div>
          <div className="text-xl font-bold">{formData.beds}</div>
          <div className="text-sm text-gray-600">BEDROOMS</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
          <div className="text-xl mb-2">🚿</div>
          <div className="text-xl font-bold">{formData.baths}</div>
          <div className="text-sm text-gray-600">BATHROOMS</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
          <div className="text-xl mb-2">📐</div>
          <div className="text-xl font-bold">{formatNumber(formData.sqft)}</div>
          <div className="text-sm text-gray-600">SQ FT</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
          <div className="text-xl mb-2">🗓️</div>
          <div className="text-xl font-bold">{formData.yearBuilt}</div>
          <div className="text-sm text-gray-600">YEAR BUILT</div>
        </div>
        {formData.lotSize > 0 && (
          <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
            <div className="text-xl mb-2">🌳</div>
            <div className="text-xl font-bold">{formData.lotSize}</div>
            <div className="text-sm text-gray-600">LOT SIZE (AC)</div>
          </div>
        )}
        {formData.zoning && (
          <div className="bg-gray-50 p-4 rounded border-2 border-gray-200 text-center">
            <div className="text-xl mb-2">🏛️</div>
            <div className="text-xl font-bold">{formData.zoning}</div>
            <div className="text-sm text-gray-600">ZONING</div>
          </div>
        )}
      </div>
    </div>
  )
);

// Property Details Section
export const PropertyDetailsSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const hasPropertyDetails = formData.roofAge || formData.roofCondition || formData.roofNotes ||
      formData.hvacAge || formData.hvacCondition || formData.hvacNotes ||
      formData.waterHeaterAge || formData.waterHeaterCondition || formData.waterHeaterNotes ||
      formData.sidingType || formData.sidingCondition || formData.sidingNotes ||
      formData.additionalNotes;

    if (!hasPropertyDetails) return null;

    return (
      <div ref={ref} data-pdf-section="propertyDetails" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
          🔍 Property Details
        </h2>
        <div className="space-y-4">
          {(formData.roofAge || formData.roofCondition || formData.roofNotes) && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">Roof</h3>
              {formData.roofAge && <p><strong>Age:</strong> {formData.roofAge}</p>}
              {formData.roofCondition && <p><strong>Condition:</strong> {formData.roofCondition}</p>}
              {formData.roofNotes && <p className="italic mt-2">{formData.roofNotes}</p>}
            </div>
          )}
          {(formData.hvacAge || formData.hvacCondition || formData.hvacNotes) && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">HVAC</h3>
              {formData.hvacAge && <p><strong>Age:</strong> {formData.hvacAge}</p>}
              {formData.hvacCondition && <p><strong>Condition:</strong> {formData.hvacCondition}</p>}
              {formData.hvacNotes && <p className="italic mt-2">{formData.hvacNotes}</p>}
            </div>
          )}
          {(formData.waterHeaterAge || formData.waterHeaterCondition || formData.waterHeaterNotes) && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">Hot Water Heater</h3>
              {formData.waterHeaterAge && <p><strong>Age:</strong> {formData.waterHeaterAge}</p>}
              {formData.waterHeaterCondition && <p><strong>Condition:</strong> {formData.waterHeaterCondition}</p>}
              {formData.waterHeaterNotes && <p className="italic mt-2">{formData.waterHeaterNotes}</p>}
            </div>
          )}
          {(formData.sidingType || formData.sidingCondition || formData.sidingNotes) && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">Siding</h3>
              {formData.sidingType && <p><strong>Type:</strong> {formData.sidingType}</p>}
              {formData.sidingCondition && <p><strong>Condition:</strong> {formData.sidingCondition}</p>}
              {formData.sidingNotes && <p className="italic mt-2">{formData.sidingNotes}</p>}
            </div>
          )}
          {formData.additionalNotes && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
              <p>{formData.additionalNotes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Comps Section
export const CompsSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const formatComps = (comps: string[], title: string) => {
      const validComps = comps.filter(comp => comp.trim());
      if (!validComps.length) return null;

      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
          <div className="space-y-2">
            {validComps.map((comp, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">{index + 1}.</span>
                <a href={comp} className="text-blue-600 underline break-all hover:text-blue-800">
                  {comp}
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const hasComps = formData.pendingComps.some(c => c.trim()) ||
      formData.soldComps.some(c => c.trim()) ||
      formData.rentalComps.some(c => c.trim()) ||
      formData.newConstructionComps.some(c => c.trim()) ||
      formData.asIsComps.some(c => c.trim());

    if (!hasComps) return null;

    return (
      <div ref={ref} data-pdf-section="comps" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
          📊 Comparable Properties
        </h2>
        <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
          {formatComps(formData.pendingComps, "Pending Flipped Comps")}
          {formatComps(formData.soldComps, "Sold Flipped Comps")}
          {formatComps(formData.rentalComps, "Rental Comps")}
          {formatComps(formData.newConstructionComps, "New Construction Comps")}
          {formatComps(formData.asIsComps, "Sold As-Is Comps")}
        </div>
      </div>
    );
  }
);

// Occupancy Section
export const OccupancySection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    if (!formData.occupancy) return null;

    return (
      <div ref={ref} data-pdf-section="occupancy" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
          👥 Occupancy Status
        </h2>
        <div className="bg-blue-50 border-2 border-blue-500 rounded p-4">
          <div className="text-lg font-semibold text-blue-800 mb-2">Current Status</div>
          <div className="text-blue-700">{formData.occupancy.replace(/-/g, ' ').toUpperCase()}</div>
          {formData.leaseTerms && (
            <div className="mt-3">
              <div className="font-semibold text-blue-800">Lease Terms</div>
              <div className="text-blue-700">{formData.leaseTerms}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Access Section
export const AccessSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    if (!formData.access) return null;

    return (
      <div ref={ref} data-pdf-section="access" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
          🔑 Property Access
        </h2>
        <div className="bg-blue-50 border-2 border-blue-500 rounded p-4">
          <div className="text-lg font-semibold text-blue-800 mb-2">Access Method</div>
          <div className="text-blue-700">{formData.access.replace(/-/g, ' ').toUpperCase()}</div>
          {formData.access === 'lockbox' && formData.lockboxCode && (
            <div className="mt-3 bg-yellow-100 border border-yellow-400 rounded p-3">
              <div className="font-semibold text-yellow-800">Lockbox Code</div>
              <div className="text-xl font-bold text-yellow-700">{formData.lockboxCode}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Exit Strategy Section
export const ExitStrategySection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const hasExitStrategy = formData.exitStrategy || formData.rentalBackup;
    if (!hasExitStrategy) return null;

    return (
      <div ref={ref} data-pdf-section="exitStrategy" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-blue-500 pb-2">
          🎯 Exit Strategy
        </h2>
        <div className="space-y-4">
          {formData.exitStrategy && (
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-semibold mb-2 text-gray-800">Strategy Notes</h3>
              <p className="text-gray-700">{formData.exitStrategy}</p>
            </div>
          )}
          {formData.rentalBackup && (
            <div className="bg-green-50 border-2 border-green-500 rounded p-4">
              <div className="text-lg font-semibold text-green-800 mb-2">🏠 Rental Backup Plan Available</div>
              {formData.rentalBackupDetails && (
                <p className="text-green-700">{formData.rentalBackupDetails}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

// EMD & Closing Section
export const EMDClosingSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const hasEMDInfo = formData.emdAmount > 0 || formData.closingDate || formData.memoFiled;
    if (!hasEMDInfo) return null;

    return (
      <div ref={ref} data-pdf-section="emdClosing" className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-red-500 pb-2">
          📋 EMD & Closing Information
        </h2>
        <div className="bg-red-50 border-2 border-red-500 rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {formData.emdAmount > 0 && (
              <div className="bg-white/70 p-3 rounded">
                <div className="text-sm font-semibold text-red-800">EMD Amount</div>
                <div className="text-lg font-bold text-red-700">{formatCurrency(formData.emdAmount)}</div>
              </div>
            )}
            {formData.closingDate && (
              <div className="bg-white/70 p-3 rounded">
                <div className="text-sm font-semibold text-red-800">Closing Date</div>
                <div className="text-lg font-bold text-red-700">
                  {formData.closingDate.toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
          {formData.memoFiled && (
            <div className="bg-yellow-100 border border-yellow-400 rounded p-3 text-center">
              <div className="font-bold text-yellow-800 text-sm">
                ⚠️ MEMORANDUM OF CONTRACT FILED
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Contact Section
export const ContactSection = forwardRef<HTMLDivElement, PDFSectionProps>(
  ({ formData }, ref) => {
    const hasContactInfo = formData.contactName || formData.contactPhone || 
      formData.contactEmail || formData.businessHours;
    
    if (!hasContactInfo) return null;

    return (
      <div ref={ref} data-pdf-section="contact" className="bg-white p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">📞 Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.contactName && (
              <div className="bg-white/20 p-3 rounded">
                <div className="text-sm opacity-90">Contact</div>
                <div className="text-lg font-semibold">{formData.contactName}</div>
              </div>
            )}
            {formData.contactPhone && (
              <div className="bg-white/20 p-3 rounded">
                <div className="text-sm opacity-90">Phone</div>
                <a href={`tel:${formData.contactPhone}`} className="text-lg font-semibold hover:underline">
                  {formData.contactPhone}
                </a>
              </div>
            )}
            {formData.contactEmail && (
              <div className="bg-white/20 p-3 rounded">
                <div className="text-sm opacity-90">Email</div>
                <a href={`mailto:${formData.contactEmail}`} className="text-lg font-semibold hover:underline">
                  {formData.contactEmail}
                </a>
              </div>
            )}
            {formData.businessHours && (
              <div className="bg-white/20 p-3 rounded">
                <div className="text-sm opacity-90">Hours</div>
                <div className="text-lg font-semibold">{formData.businessHours}</div>
              </div>
            )}
          </div>
          <div className="text-center mt-6 bg-red-600 text-white p-4 rounded">
            <div className="text-xl font-bold mb-2">🚀 Ready to Move Forward?</div>
            <div className="text-sm opacity-90">Contact us today to discuss this opportunity!</div>
          </div>
        </div>
      </div>
    );
  }
);