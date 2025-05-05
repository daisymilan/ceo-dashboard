/**
 * Utility functions for formatting data in the CEO Dashboard
 */

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

/**
 * Format a time
 * 
 * @param {string|Date} time - The time to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} - The formatted time
 */
export const formatTime = (time, includeSeconds = false) => {
  if (!time) return '-';
  
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(timeObj);
};

/**
 * Format a datetime
 * 
 * @param {string|Date} datetime - The datetime to format
 * @param {string} dateFormat - The format to use for the date ('short', 'medium', 'long', 'full')
 * @param {boolean} includeSeconds - Whether to include seconds in the time
 * @returns {string} - The formatted datetime
 */
export const formatDateTime = (datetime, dateFormat = 'medium', includeSeconds = false) => {
  if (!datetime) return '-';
  
  return `${formatDate(datetime, dateFormat)} ${formatTime(datetime, includeSeconds)}`;
};

/**
 * Format a change value (e.g., +10%, -5%)
 * 
 * @param {number} value - The change value
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} - The formatted change value
 */
export const formatChange = (value, includeSymbol = true, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  
  const sign = value > 0 ? '+' : '';
  const formattedValue = formatPercent(Math.abs(value), includeSymbol, decimals);
  
  return `${sign}${formattedValue}`;
};

/**
 * Convert a number to a shortened version (e.g., 1.2K, 5.7M)
 * 
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} - The shortened number
 */
export const shortenNumber = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  
  if (Math.abs(value) >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}B`;
  } else if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }
  
  return value.toFixed(decimals);
};

/**
 * Format a duration in milliseconds to a human-readable format
 * 
 * @param {number} milliseconds - The duration in milliseconds
 * @param {boolean} includeMilliseconds - Whether to include milliseconds
 * @returns {string} - The formatted duration
 */
export const formatDuration = (milliseconds, includeMilliseconds = false) => {
  if (milliseconds === null || milliseconds === undefined) return '-';
  
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const ms = milliseconds % 1000;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }
  
  result += `${seconds}s`;
  
  if (includeMilliseconds) {
    result += ` ${ms}ms`;
  }
  
  return result;
};

/**
 * Truncate a string with an ellipsis
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} - The truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get color based on value (e.g., for KPIs)
 * 
 * @param {number} value - The value
 * @param {number} threshold1 - First threshold (default: 0)
 * @param {number} threshold2 - Second threshold (default: 5)
 * @returns {string} - The color variable
 */
export const getColorForValue = (value, threshold1 = 0, threshold2 = 5) => {
  if (value === null || value === undefined) return 'var(--text-secondary)';
  
  if (value >= threshold2) {
    return 'var(--success)';
  } else if (value >= threshold1) {
    return 'var(--warning)';
  } else {
    return 'var(--danger)';
  }
};

/**
 * Calculate percentage change between two values
 * 
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - The percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (current === null || current === undefined || previous === null || previous === undefined) {
    return 0;
  }
  
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Format file size
 * 
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format a phone number
 * 
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};