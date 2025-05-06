import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useData } from '../contexts/DataContext';
import DashboardCard from './common/DashboardCard';
import StatCard from './common/StatCard';
import { formatCurrency } from '../utils/formatters';
import '../styles/SalesOverview.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesOverview = () => {
  const { 
    salesData, 
    loadingSales, 
    salesTimeframe, 
    setSalesTimeframe
  } = useData();
  
  // Handle timeframe change
  const handleTimeframeChange = (timeframe) => {
    setSalesTimeframe(timeframe);
  };
  
  if (loadingSales || !salesData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading sales data...</p>
      </div>
    );
  }
  
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
          padding: 10,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
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
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
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
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="sales-overview">
      <div className="page-header">
        <h2>Sales Overview</h2>
        <div className="timeframe-selector">
          <button 
            className={salesTimeframe === 'daily' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('daily')}
          >
            Daily
          </button>
          <button 
            className={salesTimeframe === 'weekly' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={salesTimeframe === 'monthly' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(salesData.totalRevenue)} 
          change={salesData.revenueChange} 
          icon="dollar-sign"
        />
        <StatCard 
          title="Orders" 
          value={salesData.totalOrders.toLocaleString()} 
          change={salesData.orderChange} 
          icon="shopping-bag"
        />
        <StatCard 
          title="Average Order Value" 
          value={formatCurrency(salesData.averageOrderValue)} 
          change={salesData.aovChange} 
          icon="chart-line"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${salesData.conversionRate}%`} 
          change={salesData.conversionChange} 
          icon="percent"
        />
      </div>

      <div className="charts-grid">
        <DashboardCard title="Revenue Trend" className="chart-card large">
          <div className="chart-container">
            <Line 
              data={salesData.revenueTrend} 
              options={chartOptions} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Top Products" className="chart-card">
          <div className="chart-container">
            <Bar 
              data={salesData.topProducts} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales.x,
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Sales by Channel" className="chart-card">
          <div className="chart-container">
            <Doughnut 
              data={salesData.salesByChannel} 
              options={doughnutOptions} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Geographic Distribution" className="chart-card">
          <div className="chart-container">
            <Doughnut 
              data={salesData.geographicDistribution} 
              options={doughnutOptions} 
            />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard title="Recent Orders" className="orders-card">
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesData.recentOrders && salesData.recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.products}</td>
                  <td>{formatCurrency(order.amount)}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SalesOverview;