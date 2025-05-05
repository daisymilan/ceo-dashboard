import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSalesData, fetchInventoryData } from '../api/woocommerce';
import { fetchMarketTrends, createForecast } from '../api/grok';
import { fetchSocialMediaMetrics } from '../api/socialMedia';

// Create context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Provider component
export const DataProvider = ({ children }) => {
  // Sales data state
  const [salesData, setSalesData] = useState(null);
  const [salesTimeframe, setSalesTimeframe] = useState('daily');
  const [loadingSales, setLoadingSales] = useState(true);
  
  // Inventory data state
  const [inventoryData, setInventoryData] = useState(null);
  const [inventoryWarehouse, setInventoryWarehouse] = useState('all');
  const [loadingInventory, setLoadingInventory] = useState(true);
  
  // Market trends state
  const [marketTrends, setMarketTrends] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(true);
  
  // Social media metrics state
  const [socialMetrics, setSocialMetrics] = useState(null);
  const [socialPlatform, setSocialPlatform] = useState('all');
  const [loadingSocial, setLoadingSocial] = useState(true);

  // Last refresh timestamp
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Load sales data
  const loadSalesData = async (timeframe = salesTimeframe) => {
    setLoadingSales(true);
    try {
      const data = await fetchSalesData(timeframe);
      setSalesData(data);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoadingSales(false);
    }
  };
  
  // Load inventory data
  const loadInventoryData = async (warehouse = inventoryWarehouse) => {
    setLoadingInventory(true);
    try {
      const data = await fetchInventoryData(warehouse);
      setInventoryData(data);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoadingInventory(false);
    }
  };
  
  // Load market trends
  const loadMarketTrends = async (query = 'fragrance industry') => {
    setLoadingTrends(true);
    try {
      const data = await fetchMarketTrends(query);
      setMarketTrends(data.results);
    } catch (error) {
      console.error('Error loading market trends:', error);
    } finally {
      setLoadingTrends(false);
    }
  };
  
  // Load social media metrics
  const loadSocialMetrics = async (platform = socialPlatform) => {
    setLoadingSocial(true);
    try {
      const data = await fetchSocialMediaMetrics(platform);
      setSocialMetrics(data);
    } catch (error) {
      console.error('Error loading social media metrics:', error);
    } finally {
      setLoadingSocial(false);
    }
  };
  
  // Refresh all data
  const refreshAllData = async () => {
    Promise.all([
      loadSalesData(),
      loadInventoryData(),
      loadMarketTrends(),
      loadSocialMetrics()
    ]).then(() => {
      setLastRefresh(new Date());
    });
  };
  
  // Load initial data on mount
  useEffect(() => {
    refreshAllData();
    
    // Set up refresh interval (every 5 minutes)
    const intervalId = setInterval(refreshAllData, 5 * 60 * 1000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Update sales data when timeframe changes
  useEffect(() => {
    loadSalesData(salesTimeframe);
  }, [salesTimeframe]);
  
  // Update inventory data when warehouse changes
  useEffect(() => {
    loadInventoryData(inventoryWarehouse);
  }, [inventoryWarehouse]);
  
  // Update social metrics when platform changes
  useEffect(() => {
    loadSocialMetrics(socialPlatform);
  }, [socialPlatform]);
  
  // Context value
  const value = {
    // Sales data
    salesData,
    loadingSales,
    salesTimeframe,
    setSalesTimeframe,
    loadSalesData,
    
    // Inventory data
    inventoryData,
    loadingInventory,
    inventoryWarehouse,
    setInventoryWarehouse,
    loadInventoryData,
    
    // Market trends
    marketTrends,
    loadingTrends,
    loadMarketTrends,
    
    // Social media metrics
    socialMetrics,
    loadingSocial,
    socialPlatform,
    setSocialPlatform,
    loadSocialMetrics,
    
    // General
    lastRefresh,
    refreshAllData
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};