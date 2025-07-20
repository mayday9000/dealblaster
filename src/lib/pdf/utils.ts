/**
 * Utility functions for PDF generation
 */

/**
 * Formats currency values for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats numbers with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Calculates financial metrics
 */
export const calculateFinancials = (data: {
  purchasePrice: number;
  rehabEstimate: number;
  arv: number;
  sellingCosts: number;
}) => {
  const totalInvestment = data.purchasePrice + data.rehabEstimate;
  const grossProfit = data.arv - totalInvestment;
  const sellingCostAmount = Math.round(data.arv * (data.sellingCosts / 100));
  const netProfit = grossProfit - sellingCostAmount;
  
  return {
    totalInvestment,
    grossProfit,
    sellingCostAmount,
    netProfit,
  };
};

/**
 * Generates title and subtitle based on property data
 */
export const generateTitles = (data: {
  address: string;
  purchasePrice: number;
  rehabEstimate: number;
  arv: number;
}) => {
  const { grossProfit } = calculateFinancials({
    purchasePrice: data.purchasePrice,
    rehabEstimate: data.rehabEstimate,
    arv: data.arv,
    sellingCosts: 8, // Default selling costs
  });

  const title = `🏠 Fix & Flip Opportunity - ${formatCurrency(grossProfit)} Profit Potential`;
  const subtitle = `Investment Property Analysis`;
  
  return { title, subtitle };
};