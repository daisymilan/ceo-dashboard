// src/utils/formatters.js

/**
 * Format a number as currency (USD)
 * 
 * @param {number} value - The value to format
 * @param {boolean} abbreviated - Whether to abbreviate large numbers (e.g., $1.2M)
 * @returns {string} - The formatted currency value
 */
export const formatCurrency = (value, abbreviated = false) => {
  if (value === null || value === undefined) return '-';
  
  if (abbreviated && Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (abbreviated && Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number with commas
 * 
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} - The formatted number
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a percentage
 * 
 * @param {number} value - The value to format (e.g., 0.15 for 15%)
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} - The formatted percentage
 */
export const formatPercent = (value, includeSymbol = true, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  
  // If value is already a percentage (e.g., 15 instead of 0.15)
  const percentValue = value > 1 ? value : value * 100;
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(percentValue);
  
  return includeSymbol ? `${formattedValue}%` : formattedValue;
};

/**
 * Format a date
 * 
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use ('short', 'medium', 'long', 'full')
 * @returns {string} - The formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(dateObj);
};