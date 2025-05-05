// woocommerce.js - API integration with WooCommerce
import { executeN8nWorkflow } from './n8n';

/**
 * Fetches sales data from WooCommerce via n8n
 * 
 * @param {string} timeframe - The timeframe for data ('daily', 'weekly', 'monthly')
 * @param {Object} filters - Optional additional filters
 * @returns {Promise<Object>} - The sales data
 */
export const fetchSalesData = async (timeframe = 'daily', filters = {}) => {
  try {
    // In production, this would call an n8n workflow
    // For the prototype, we'll return mock data
    // const result = await executeN8nWorkflow('woocommerce-sales-data', { timeframe, ...filters });
    // return result.data;
    
    return getMockSalesData(timeframe);
  } catch (error) {
    console.error('Error fetching WooCommerce sales data:', error);
    throw error;
  }
};

/**
 * Fetches inventory data from WooCommerce via n8n
 * 
 * @param {string} warehouse - Optional warehouse filter ('all', 'las-vegas', 'nice', 'dubai', 'riyadh')
 * @returns {Promise<Object>} - The inventory data
 */
export const fetchInventoryData = async (warehouse = 'all') => {
  try {
    // In production, this would call an n8n workflow
    // const result = await executeN8nWorkflow('woocommerce-inventory', { warehouse });
    // return result.data;
    
    return getMockInventoryData(warehouse);
  } catch (error) {
    console.error('Error fetching WooCommerce inventory data:', error);
    throw error;
  }
};

/**
 * Fetches product data from WooCommerce via n8n
 * 
 * @param {string} productId - Optional specific product ID to fetch
 * @param {Object} filters - Optional additional filters
 * @returns {Promise<Object>} - The product data
 */
export const fetchProductData = async (productId = null, filters = {}) => {
  try {
    // In production, this would call an n8n workflow
    // const result = await executeN8nWorkflow('woocommerce-products', { productId, ...filters });
    // return result.data;
    
    return getMockProductData(productId);
  } catch (error) {
    console.error('Error fetching WooCommerce product data:', error);
    throw error;
  }
};

/**
 * Fetches order data from WooCommerce via n8n
 * 
 * @param {string} orderId - Optional specific order ID to fetch
 * @param {Object} filters - Optional additional filters (status, date range, etc.)
 * @returns {Promise<Object>} - The order data
 */
export const fetchOrderData = async (orderId = null, filters = {}) => {
  try {
    // In production, this would call an n8n workflow
    // const result = await executeN8nWorkflow('woocommerce-orders', { orderId, ...filters });
    // return result.data;
    
    return getMockOrderData(orderId, filters);
  } catch (error) {
    console.error('Error fetching WooCommerce order data:', error);
    throw error;
  }
};

// Mock data functions for prototype development
const getMockSalesData = (timeframe) => {
  // Labels for different timeframes
  const labels = {
    daily: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
    weekly: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  };

  // Revenue data for different timeframes
  const revenueData = {
    daily: [1200, 1800, 2200, 3500, 2700, 2100, 3200, 4100, 3700],
    weekly: [18500, 21000, 19200, 22500, 24700, 26100, 25200],
    monthly: [85000, 92000, 88000, 103000]
  };

  // Top products data
  const topProductsData = {
    daily: {
      labels: ['Duality', 'Moon Dust', 'Momento', 'Dahab', 'Coda'],
      datasets: [{
        label: 'Units Sold',
        data: [8, 6, 5, 4, 3],
        backgroundColor: 'rgba(147, 104, 233, 0.7)'
      }]
    },
    weekly: {
      labels: ['Duality', 'Moon Dust', 'Momento', 'Dahab', 'Coda'],
      datasets: [{
        label: 'Units Sold',
        data: [42, 38, 33, 27, 24],
        backgroundColor: 'rgba(147, 104, 233, 0.7)'
      }]
    },
    monthly: {
      labels: ['Duality', 'Moon Dust', 'Momento', 'Dahab', 'Coda'],
      datasets: [{
        label: 'Units Sold',
        data: [156, 142, 122, 104, 98],
        backgroundColor: 'rgba(147, 104, 233, 0.7)'
      }]
    }
  };

  // Sales by channel data
  const channelData = {
    daily: {
      labels: ['Website', 'Retail Partners', 'Amazon', 'B2B', 'Direct Sales'],
      datasets: [{
        label: 'Revenue ($)',
        data: [8500, 6700, 4200, 3100, 2200],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    },
    weekly: {
      labels: ['Website', 'Retail Partners', 'Amazon', 'B2B', 'Direct Sales'],
      datasets: [{
        label: 'Revenue ($)',
        data: [58500, 43700, 32200, 29100, 18200],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    },
    monthly: {
      labels: ['Website', 'Retail Partners', 'Amazon', 'B2B', 'Direct Sales'],
      datasets: [{
        label: 'Revenue ($)',
        data: [158500, 123700, 98200, 87100, 68200],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    }
  };

  // Geographic distribution
  const geoData = {
    daily: {
      labels: ['US', 'Europe', 'Middle East', 'Asia', 'Other'],
      datasets: [{
        label: 'Revenue ($)',
        data: [9800, 4700, 7200, 3100, 1200],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    },
    weekly: {
      labels: ['US', 'Europe', 'Middle East', 'Asia', 'Other'],
      datasets: [{
        label: 'Revenue ($)',
        data: [68800, 32700, 51200, 24100, 9200],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    },
    monthly: {
      labels: ['US', 'Europe', 'Middle East', 'Asia', 'Other'],
      datasets: [{
        label: 'Revenue ($)',
        data: [248800, 142700, 201200, 104100, 49200],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    }
  };

  return {
    totalRevenue: timeframe === 'daily' ? 24700 : timeframe === 'weekly' ? 157200 : 368000,
    revenueChange: timeframe === 'daily' ? 12 : timeframe === 'weekly' ? 8 : 15,
    totalOrders: timeframe === 'daily' ? 142 : timeframe === 'weekly' ? 924 : 3840,
    orderChange: timeframe === 'daily' ? 8 : timeframe === 'weekly' ? 5 : 12,
    averageOrderValue: timeframe === 'daily' ? 174 : timeframe === 'weekly' ? 170 : 168,
    aovChange: timeframe === 'daily' ? 4 : timeframe === 'weekly' ? 2 : -1,
    conversionRate: timeframe === 'daily' ? 3.8 : timeframe === 'weekly' ? 3.5 : 3.6,
    conversionChange: timeframe === 'daily' ? 0.6 : timeframe === 'weekly' ? 0.2 : 0.4,
    
    revenueTrend: {
      labels: labels[timeframe],
      datasets: [
        {
          label: 'Revenue',
          data: revenueData[timeframe],
          borderColor: 'rgba(147, 104, 233, 1)',
          backgroundColor: 'rgba(147, 104, 233, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    
    topProducts: topProductsData[timeframe],
    salesByChannel: channelData[timeframe],
    geographicDistribution: geoData[timeframe]
  };
};

const getMockInventoryData = (warehouse) => {
  // For prototype only
  const allWarehouses = {
    'las-vegas': {
      capacity: 82,
      totalProducts: 5624,
      lowStock: 12,
      outOfStock: 3,
      recentDeliveries: 4,
      pendingShipments: 7
    },
    'nice': {
      capacity: 65,
      totalProducts: 4218,
      lowStock: 8,
      outOfStock: 2,
      recentDeliveries: 2,
      pendingShipments: 5
    },
    'dubai': {
      capacity: 43,
      totalProducts: 2876,
      lowStock: 15,
      outOfStock: 6,
      recentDeliveries: 1,
      pendingShipments: 10
    },
    'riyadh': {
      capacity: 71,
      totalProducts: 3752,
      lowStock: 9,
      outOfStock: 4,
      recentDeliveries: 3,
      pendingShipments: 4
    }
  };
  
  // Product inventory across warehouses
  const products = [
    {
      id: 'p001',
      name: 'Duality',
      sku: 'MIN-DUA-100',
      stock: {
        'las-vegas': 142,
        'nice': 87,
        'dubai': 63,
        'riyadh': 95
      },
      lowStockThreshold: 50,
      reorderPoint: 30
    },
    {
      id: 'p002',
      name: 'Moon Dust',
      sku: 'MIN-MOO-100',
      stock: {
        'las-vegas': 76,
        'nice': 54,
        'dubai': 5,
        'riyadh': 42
      },
      lowStockThreshold: 40,
      reorderPoint: 20
    },
    {
      id: 'p003',
      name: 'Momento',
      sku: 'MIN-MOM-100',
      stock: {
        'las-vegas': 104,
        'nice': 73,
        'dubai': 51,
        'riyadh': 88
      },
      lowStockThreshold: 50,
      reorderPoint: 30
    },
    {
      id: 'p004',
      name: 'Dahab',
      sku: 'MIN-DAH-100',
      stock: {
        'las-vegas': 58,
        'nice': 37,
        'dubai': 29,
        'riyadh': 44
      },
      lowStockThreshold: 30,
      reorderPoint: 20
    },
    {
      id: 'p005',
      name: 'Coda',
      sku: 'MIN-COD-100',
      stock: {
        'las-vegas': 89,
        'nice': 62,
        'dubai': 48,
        'riyadh': 75
      },
      lowStockThreshold: 40,
      reorderPoint: 25
    }
  ];
  
  if (warehouse !== 'all') {
    return {
      warehouseData: allWarehouses[warehouse],
      products: products.map(product => ({
        ...product,
        stock: product.stock[warehouse]
      }))
    };
  }
  
  return {
    warehouseData: allWarehouses,
    products
  };
};

const getMockProductData = (productId) => {
  // Mock product data
  const products = [
    {
      id: 'p001',
      name: 'Duality',
      sku: 'MIN-DUA-100',
      price: 295,
      salePrice: null,
      description: 'A masterful blend of contrasting elements: bright citrus and deep woods, creating an elegant balance.',
      category: 'Eau de Parfum',
      images: ['duality-1.jpg', 'duality-2.jpg'],
      attributes: {
        size: '50ml',
        concentration: 'Parfum',
        topNotes: 'Bergamot, Mandarin',
        heartNotes: 'Cedar, Leather',
        baseNotes: 'Amber, Musk'
      },
      stock: {
        'las-vegas': 142,
        'nice': 87,
        'dubai': 63,
        'riyadh': 95
      },
      salesData: {
        dailyAverage: 8,
        weeklyAverage: 42,
        monthlyAverage: 156,
        yearToDate: 1782
      }
    },
    {
      id: 'p002',
      name: 'Moon Dust',
      sku: 'MIN-MOO-100',
      price: 275,
      salePrice: null,
      description: 'An ethereal fragrance that evokes the mysterious essence of lunar landscapes with silver musk and cool florals.',
      category: 'Eau de Parfum',
      images: ['moondust-1.jpg', 'moondust-2.jpg'],
      attributes: {
        size: '50ml',
        concentration: 'Parfum',
        topNotes: 'Violet Leaf, Aldehydes',
        heartNotes: 'Iris, Mimosa',
        baseNotes: 'Silver Musk, Ambrette'
      },
      stock: {
        'las-vegas': 76,
        'nice': 54,
        'dubai': 5,
        'riyadh': 42
      },
      salesData: {
        dailyAverage: 6,
        weeklyAverage: 38,
        monthlyAverage: 142,
        yearToDate: 1624
      }
    }
  ];
  
  if (productId) {
    return products.find(p => p.id === productId) || null;
  }
  
  return products;
};

const getMockOrderData = (orderId, filters = {}) => {
  // Mock order data
  const orders = [
    {
      id: 'o12345',
      customerName: 'Alexander Johnson',
      customerEmail: 'alex.johnson@example.com',
      date: '2025-05-05T10:30:00Z',
      status: 'completed',
      total: 590,
      items: [
        {
          productId: 'p001',
          name: 'Duality',
          quantity: 2,
          price: 295,
          total: 590
        }
      ],
      shipping: {
        method: 'Express',
        address: '123 Luxury Lane, Beverly Hills, CA 90210',
        cost: 0,
        tracking: 'UPS12345678'
      },
      payment: {
        method: 'Credit Card',
        cardType: 'Visa',
        last4: '4242'
      }
    },
    {
      id: 'o12346',
      customerName: 'Sophia Williams',
      customerEmail: 'sophia.w@example.com',
      date: '2025-05-05T11:45:00Z',
      status: 'processing',
      total: 845,
      items: [
        {
          productId: 'p001',
          name: 'Duality',
          quantity: 1,
          price: 295,
          total: 295
        },
        {
          productId: 'p002',
          name: 'Moon Dust',
          quantity: 2,
          price: 275,
          total: 550
        }
      ],
      shipping: {
        method: 'Standard',
        address: '456 Park Avenue, New York, NY 10022',
        cost: 0,
        tracking: null
      },
      payment: {
        method: 'Credit Card',
        cardType: 'Mastercard',
        last4: '8765'
      }
    }
  ];
  
  if (orderId) {
    return orders.find(o => o.id === orderId) || null;
  }
  
  // Apply filters if provided
  let filteredOrders = [...orders];
  
  if (filters.status) {
    filteredOrders = filteredOrders.filter(o => o.status === filters.status);
  }
  
  // Add more filter logic as needed
  
  return filteredOrders;
};