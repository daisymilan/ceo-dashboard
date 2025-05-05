import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { FaBoxes, FaExclamationTriangle, FaTruck, FaWarehouse } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import DashboardCard from './common/DashboardCard';
import StatCard from './common/StatCard';
import '../styles/InventoryStatus.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryStatus = () => {
  const { 
    inventoryData, 
    loadingInventory, 
    inventoryWarehouse, 
    setInventoryWarehouse, 
    loadInventoryData 
  } = useData();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Handle warehouse change
  const handleWarehouseChange = (warehouse) => {
    setInventoryWarehouse(warehouse);
  };
  
  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product === selectedProduct ? null : product);
  };
  
  if (loadingInventory || !inventoryData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading inventory data...</p>
      </div>
    );
  }
  
  // Prepare warehouse capacity data for chart
  const getWarehouseCapacityData = () => {
    if (inventoryWarehouse !== 'all') {
      return {
        labels: ['Capacity'],
        datasets: [
          {
            label: 'Used',
            data: [inventoryData.warehouseData.capacity],
            backgroundColor: 'rgba(147, 104, 233, 0.7)'
          },
          {
            label: 'Available',
            data: [100 - inventoryData.warehouseData.capacity],
            backgroundColor: 'rgba(220, 220, 220, 0.7)'
          }
        ]
      };
    }
    
    return {
      labels: ['Las Vegas', 'Nice', 'Dubai', 'Riyadh'],
      datasets: [
        {
          label: 'Used Capacity (%)',
          data: [
            inventoryData.warehouseData['las-vegas'].capacity,
            inventoryData.warehouseData['nice'].capacity,
            inventoryData.warehouseData['dubai'].capacity,
            inventoryData.warehouseData['riyadh'].capacity
          ],
          backgroundColor: 'rgba(147, 104, 233, 0.7)'
        }
      ]
    };
  };
  
  // Prepare product stock data for chart
  const getProductStockData = () => {
    return {
      labels: inventoryData.products.map(p => p.name),
      datasets: [
        {
          label: 'Current Stock',
          data: inventoryData.products.map(p => 
            inventoryWarehouse === 'all' ? 
              Object.values(p.stock).reduce((sum, current) => sum + current, 0) : 
              p.stock[inventoryWarehouse]
          ),
          backgroundColor: 'rgba(147, 104, 233, 0.7)'
        },
        {
          label: 'Low Stock Threshold',
          data: inventoryData.products.map(p => p.lowStockThreshold * (inventoryWarehouse === 'all' ? 4 : 1)),
          backgroundColor: 'rgba(255, 159, 64, 0.7)'
        },
        {
          label: 'Reorder Point',
          data: inventoryData.products.map(p => p.reorderPoint * (inventoryWarehouse === 'all' ? 4 : 1)),
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Montserrat',
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Montserrat',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Montserrat',
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        },
        ticks: {
          font: {
            family: 'Montserrat',
            size: 12
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Montserrat',
            size: 12
          },
          padding: 10
        }
      }
    }
  };
  
  // Get warehouse metrics
  const getWarehouseMetrics = () => {
    if (inventoryWarehouse !== 'all') {
      const data = inventoryData.warehouseData;
      return {
        capacity: data.capacity,
        totalProducts: data.totalProducts,
        lowStock: data.lowStock,
        outOfStock: data.outOfStock,
        recentDeliveries: data.recentDeliveries,
        pendingShipments: data.pendingShipments
      };
    }
    
    // Calculate totals for all warehouses
    const data = inventoryData.warehouseData;
    return {
      capacity: Math.round(
        (data['las-vegas'].capacity + data['nice'].capacity + 
         data['dubai'].capacity + data['riyadh'].capacity) / 4
      ),
      totalProducts: 
        data['las-vegas'].totalProducts + data['nice'].totalProducts + 
        data['dubai'].totalProducts + data['riyadh'].totalProducts,
      lowStock: 
        data['las-vegas'].lowStock + data['nice'].lowStock + 
        data['dubai'].lowStock + data['riyadh'].lowStock,
      outOfStock: 
        data['las-vegas'].outOfStock + data['nice'].outOfStock + 
        data['dubai'].outOfStock + data['riyadh'].outOfStock,
      recentDeliveries: 
        data['las-vegas'].recentDeliveries + data['nice'].recentDeliveries + 
        data['dubai'].recentDeliveries + data['riyadh'].recentDeliveries,
      pendingShipments: 
        data['las-vegas'].pendingShipments + data['nice'].pendingShipments + 
        data['dubai'].pendingShipments + data['riyadh'].pendingShipments
    };
  };
  
  const metrics = getWarehouseMetrics();
  
  // Render product details
  const renderProductDetails = () => {
    if (!selectedProduct) return null;
    
    const product = inventoryData.products.find(p => p.id === selectedProduct);
    if (!product) return null;
    
    return (
      <DashboardCard 
        title={`${product.name} Details`}
        className="product-details-card"
        actions={
          <button className="close-details-btn" onClick={() => setSelectedProduct(null)}>
            ×
          </button>
        }
      >
        <div className="product-details">
          <div className="product-info">
            <div className="info-row">
              <div className="info-label">SKU:</div>
              <div className="info-value">{product.sku}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Low Stock Threshold:</div>
              <div className="info-value">{product.lowStockThreshold} units</div>
            </div>
            <div className="info-row">
              <div className="info-label">Reorder Point:</div>
              <div className="info-value">{product.reorderPoint} units</div>
            </div>
          </div>
          
          <div className="stock-by-warehouse">
            <h4>Inventory by Warehouse</h4>
            <div className="warehouse-stock-grid">
              {Object.entries(product.stock).map(([warehouse, stock]) => {
                const isLow = stock <= product.lowStockThreshold;
                const isVeryLow = stock <= product.reorderPoint;
                
                return (
                  <div 
                    key={warehouse} 
                    className={`warehouse-stock ${isVeryLow ? 'very-low' : isLow ? 'low' : ''}`}
                  >
                    <div className="warehouse-name">
                      {warehouse.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                    <div className="stock-value">
                      {stock} units
                      {isVeryLow && <FaExclamationTriangle className="warning-icon" />}
                    </div>
                    <div className="stock-bar">
                      <div 
                        className="stock-level" 
                        style={{ 
                          width: `${Math.min(100, (stock / product.lowStockThreshold) * 100)}%`,
                          backgroundColor: isVeryLow ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--success)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  };
  
  // Render product list
  const renderProductList = () => {
    return (
      <div className="product-list">
        <div className="list-header">
          <div className="header-item product-name">Product</div>
          <div className="header-item stock-level">Stock Level</div>
          <div className="header-item status">Status</div>
        </div>
        
        {inventoryData.products.map(product => {
          const totalStock = inventoryWarehouse === 'all' ? 
            Object.values(product.stock).reduce((sum, current) => sum + current, 0) : 
            product.stock[inventoryWarehouse];
          
          const threshold = product.lowStockThreshold * (inventoryWarehouse === 'all' ? 4 : 1);
          const reorderPoint = product.reorderPoint * (inventoryWarehouse === 'all' ? 4 : 1);
          
          const isLow = totalStock <= threshold;
          const isVeryLow = totalStock <= reorderPoint;
          
          let status = 'In Stock';
          let statusClass = 'in-stock';
          
          if (isVeryLow) {
            status = 'Reorder Now';
            statusClass = 'reorder';
          } else if (isLow) {
            status = 'Low Stock';
            statusClass = 'low-stock';
          }
          
          return (
            <div 
              key={product.id} 
              className={`product-item ${selectedProduct === product.id ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product.id)}
            >
              <div className="item-cell product-name">{product.name}</div>
              <div className="item-cell stock-level">
                <div className="stock-bar-container">
                  <div 
                    className="stock-bar-fill" 
                    style={{ 
                      width: `${Math.min(100, (totalStock / (threshold * 1.5)) * 100)}%`,
                      backgroundColor: isVeryLow ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--success)'
                    }}
                  ></div>
                </div>
                <div className="stock-text">{totalStock} units</div>
              </div>
              <div className={`item-cell status ${statusClass}`}>{status}</div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="inventory-status">
      <div className="page-header">
        <h2>Inventory Status</h2>
        <div className="warehouse-selector">
          <button 
            className={inventoryWarehouse === 'all' ? 'active' : ''} 
            onClick={() => handleWarehouseChange('all')}
          >
            All Warehouses
          </button>
          <button 
            className={inventoryWarehouse === 'las-vegas' ? 'active' : ''} 
            onClick={() => handleWarehouseChange('las-vegas')}
          >
            Las Vegas
          </button>
          <button 
            className={inventoryWarehouse === 'nice' ? 'active' : ''} 
            onClick={() => handleWarehouseChange('nice')}
          >
            Nice
          </button>
          <button 
            className={inventoryWarehouse === 'dubai' ? 'active' : ''} 
            onClick={() => handleWarehouseChange('dubai')}
          >
            Dubai
          </button>
          <button 
            className={inventoryWarehouse === 'riyadh' ? 'active' : ''} 
            onClick={() => handleWarehouseChange('riyadh')}
          >
            Riyadh
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          title="Warehouse Capacity" 
          value={`${metrics.capacity}%`} 
          icon="boxes"
        />
        <StatCard 
          title="Total Products" 
          value={metrics.totalProducts.toLocaleString()} 
          icon="boxes"
        />
        <StatCard 
          title="Low Stock Items" 
          value={metrics.lowStock.toString()} 
          icon="chart-bar"
        />
        <StatCard 
          title="Out of Stock" 
          value={metrics.outOfStock.toString()} 
          icon="chart-bar"
        />
      </div>
      
      <div className="charts-grid">
        <DashboardCard title="Warehouse Capacity" className="chart-card">
          <div className="chart-container">
            <Bar 
              data={getWarehouseCapacityData()} 
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    max: 100,
                    ticks: {
                      ...chartOptions.scales.y.ticks,
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Product Stock Levels" className="chart-card">
          <div className="chart-container">
            <Bar 
              data={getProductStockData()} 
              options={chartOptions} 
            />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard title="Products" className="product-list-card">
        {renderProductList()}
      </DashboardCard>
      
      {renderProductDetails()}
    </div>
  );
};

export default InventoryStatus;