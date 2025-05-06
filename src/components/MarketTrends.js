import React, { useState } from 'react';
import { 
  Line, 
  Bar, 
  Radar,
  PolarArea 
} from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { FaChartLine, FaGlobe, FaUsers, FaIndustry } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { fetchMarketTrends } from '../api/grok';
import DashboardCard from './common/DashboardCard';
import StatCard from './common/StatCard';
import '../styles/MarketTrends.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketTrends = () => {
  const { marketTrends, loadingTrends, loadMarketTrends } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('sales');
  
  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      await loadMarketTrends(searchQuery);
    } catch (error) {
      console.error('Error searching market trends:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle forecast generation
  const handleGenerateForecast = async (metric) => {
    setSelectedMetric(metric);
    setIsForecastLoading(true);
    
    try {
      const result = await createForecast(metric);
      setForecast(result.forecast);
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setIsForecastLoading(false);
    }
  };
  
  if (loadingTrends || !marketTrends) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading market trends data...</p>
      </div>
    );
  }
  
  // Chart options
  const lineChartOptions = {
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
  
  const barChartOptions = {
    ...lineChartOptions,
    indexAxis: 'y',
    scales: {
      ...lineChartOptions.scales,
      x: {
        ...lineChartOptions.scales.x,
        beginAtZero: true
      }
    }
  };
  
  const radarChartOptions = {
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
      r: {
        angleLines: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        pointLabels: {
          font: {
            family: 'Montserrat',
            size: 12
          }
        },
        ticks: {
          backdropColor: 'transparent',
          font: {
            family: 'Montserrat',
            size: 10
          }
        }
      }
    }
  };
  
  // Prepare market data for charts
  const getMarketData = () => {
    // Different visualizations based on the available data
    if (marketTrends.title.includes('Fragrance Industry')) {
      // Market growth data
      const channelData = marketTrends.data.channelPerformance;
      
      return {
        channelPerformance: {
          labels: Object.keys(channelData).map(key => 
            key === 'dtc' ? 'Direct to Consumer' : 
            key === 'ecommerce' ? 'E-commerce' : 
            key.charAt(0).toUpperCase() + key.slice(1)
          ),
          datasets: [
            {
              label: 'Growth (%)',
              data: Object.values(channelData).map(channel => channel.growth),
              backgroundColor: 'rgba(147, 104, 233, 0.7)'
            },
            {
              label: 'Margin (%)',
              data: Object.values(channelData).map(channel => channel.margin),
              backgroundColor: 'rgba(255, 159, 64, 0.7)'
            }
          ]
        },
        
        trendingCategories: {
          labels: marketTrends.data.trendingCategories,
          datasets: [
            {
              label: 'Trend Strength',
              data: [85, 78, 60], // Mock strength values
              backgroundColor: [
                'rgba(147, 104, 233, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)'
              ],
              borderColor: [
                'rgba(147, 104, 233, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
      };
    } else if (marketTrends.title.includes('Competitor')) {
      // Competitor analysis
      const strategies = marketTrends.data.strategies;
      
      return {
        competitors: {
          labels: marketTrends.data.leaders,
          datasets: [
            {
              label: 'Market Share',
              data: [25, 18, 15, 10, 8], // Mock values
              backgroundColor: [
                'rgba(147, 104, 233, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
              ],
              borderColor: [
                'rgba(147, 104, 233, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        
        distribution: {
          labels: Object.keys(strategies.distribution).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1)
          ),
          datasets: [
            {
              label: 'Distribution (%)',
              data: Object.values(strategies.distribution),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
      };
    } else if (marketTrends.title.includes('Consumer Preferences')) {
      // Consumer preferences data
      const preferences = marketTrends.data.preferences.factors;
      const demographics = marketTrends.data.demographics;
      
      return {
        preferences: {
          labels: preferences.map(pref => pref.name),
          datasets: [
            {
              label: 'Importance (%)',
              data: preferences.map(pref => pref.importance),
              backgroundColor: 'rgba(147, 104, 233, 0.7)'
            }
          ]
        },
        
        demographics: {
          labels: Object.keys(demographics.age).map(
            range => range === '25-34' ? '25-34 (Primary)' : range
          ),
          datasets: [
            {
              label: 'Age Distribution (%)',
              data: Object.values(demographics.age),
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
      };
    } else {
      // Default or Overview data
      return {
        overview: {
          labels: ['Market Growth', 'Luxury Segment', 'DTC Channel', 'Sustainability'],
          datasets: [
            {
              label: 'Industry Trends (% Growth)',
              data: [6.8, 8.2, 18.2, 22.5],
              backgroundColor: 'rgba(147, 104, 233, 0.5)',
              borderColor: 'rgba(147, 104, 233, 1)',
              borderWidth: 1
            }
          ]
        },
        
        opportunities: {
          labels: ['D2C Expansion', 'Middle East Presence', 'Limited Editions', 'Sustainability'],
          datasets: [
            {
              label: 'Opportunity Score',
              data: [9, 8.5, 7.8, 8.2],
              backgroundColor: [
                'rgba(147, 104, 233, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
              ]
            }
          ]
        }
      };
    }
  };
  
  // Get forecast chart data
  const getForecastData = () => {
    if (!forecast) return null;
    
    // Create forecast labels based on period
    const period = forecast.period || 'monthly';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    let labels;
    if (period === 'monthly') {
      labels = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth + i) % 12;
        return months[monthIndex];
      });
    } else if (period === 'quarterly') {
      const currentQuarter = Math.floor(currentMonth / 3);
      labels = Array.from({ length: 4 }, (_, i) => {
        const quarterIndex = (currentQuarter + i) % 4;
        return `Q${quarterIndex + 1}`;
      });
    } else {
      // Weekly
      labels = Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`);
    }
    
    return {
      labels,
      datasets: [
        {
          label: `${forecast.metric} Forecast`,
          data: [forecast.current, ...forecast.forecast],
          borderColor: 'rgba(147, 104, 233, 1)',
          backgroundColor: 'rgba(147, 104, 233, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };
  
  // Get forecast factors for display
  const getForecastFactors = () => {
    if (!forecast || !forecast.factors) return [];
    
    return forecast.factors.map(factor => ({
      name: factor.name,
      impact: factor.impact,
      direction: factor.direction
    }));
  };
  
  const marketData = getMarketData();
  
  return (
    <div className="market-trends">
      <div className="page-header">
        <h2>Market Trends & Analysis</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search market trends, competitors, consumer insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? (
              <div className="button-spinner"></div>
            ) : (
              <FaSearch />
            )}
          </button>
        </form>
      </div>
      
      <DashboardCard title={marketTrends.title} className="summary-card">
        <p className="market-summary">{marketTrends.summary}</p>
      </DashboardCard>
      
      <div className="stats-grid">
        {marketTrends.title.includes('Fragrance Industry') ? (
          <>
            <StatCard 
              title="Market Growth" 
              value={`${marketTrends.data.marketGrowth}%`} 
              change={1.2} // Mock change
              icon="chart-line"
            />
            <StatCard 
              title="DTC Growth" 
              value={`${marketTrends.data.channelPerformance.dtc.growth}%`} 
              change={3.5} // Mock change
              icon="chart-bar"
            />
            <StatCard 
              title="E-commerce Margin" 
              value={`${marketTrends.data.channelPerformance.ecommerce.margin}%`} 
              change={2.2} // Mock change
              icon="chart-bar"
            />
            <StatCard 
              title="Top Emerging Market" 
              value={marketTrends.data.emergingMarkets[0]} 
              icon="globe"
            />
          </>
        ) : marketTrends.title.includes('Competitor') ? (
          <>
            <StatCard 
              title="Market Leader" 
              value={marketTrends.data.leaders[0]} 
              icon="industry"
            />
            <StatCard 
              title="Growth Leader" 
              value={marketTrends.data.growthLeaders[0]} 
              icon="chart-line"
            />
            <StatCard 
              title="Avg. Price Point" 
              value={`$${marketTrends.data.strategies.pricePoints.average}`} 
              icon="dollar-sign"
            />
            <StatCard 
              title="Top Success Factor" 
              value={marketTrends.data.strategies.successFactors[0]} 
              icon="chart-bar"
            />
          </>
        ) : marketTrends.title.includes('Consumer') ? (
          <>
            <StatCard 
              title="Top Consumer Factor" 
              value={marketTrends.data.preferences.factors[0].name} 
              change={marketTrends.data.preferences.factors[0].importance / 10} // Scaled
              icon="users"
            />
            <StatCard 
              title="Primary Age Group" 
              value="25-34" 
              change={marketTrends.data.demographics.age["25-34"] / 10} // Scaled
              icon="users"
            />
            <StatCard 
              title="Brand Ethics Importance" 
              value={`${marketTrends.data.preferences.factors[1].importance}%`} 
              change={3.8} // Mock change
              icon="chart-bar"
            />
            <StatCard 
              title="Primary Income Group" 
              value="Upper" 
              change={marketTrends.data.demographics.income.upper / 10} // Scaled
              icon="dollar-sign"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Market Growth" 
              value={`${marketTrends.data.overallGrowth}%`} 
              change={0.8} // Mock change
              icon="chart-line"
            />
            <StatCard 
              title="Top Trend" 
              value={marketTrends.data.topTrends[0]} 
              icon="chart-bar"
            />
            <StatCard 
              title="Top Opportunity" 
              value={marketTrends.data.opportunities[0]} 
              icon="chart-line"
            />
            <StatCard 
              title="Primary Market" 
              value="North America" 
              icon="globe"
            />
          </>
        )}
      </div>
      
      <div className="charts-grid">
        {marketTrends.title.includes('Fragrance Industry') ? (
          <>
            <DashboardCard title="Channel Performance" className="chart-card">
              <div className="chart-container">
                <Bar 
                  data={marketData.channelPerformance} 
                  options={lineChartOptions} 
                />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Trending Categories" className="chart-card">
              <div className="chart-container">
                <PolarArea 
                  data={marketData.trendingCategories} 
                  options={{
                    ...radarChartOptions,
                    plugins: {
                      ...radarChartOptions.plugins,
                      legend: {
                        ...radarChartOptions.plugins.legend,
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </DashboardCard>
          </>
        ) : marketTrends.title.includes('Competitor') ? (
          <>
            <DashboardCard title="Market Share by Competitor" className="chart-card">
              <div className="chart-container">
                <PolarArea 
                  data={marketData.competitors} 
                  options={radarChartOptions} 
                />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Distribution Channels" className="chart-card">
              <div className="chart-container">
                <PolarArea 
                  data={marketData.distribution} 
                  options={radarChartOptions} 
                />
              </div>
            </DashboardCard>
          </>
        ) : marketTrends.title.includes('Consumer') ? (
          <>
            <DashboardCard title="Consumer Preferences" className="chart-card">
              <div className="chart-container">
                <Bar 
                  data={marketData.preferences} 
                  options={barChartOptions} 
                />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Age Demographics" className="chart-card">
              <div className="chart-container">
                <PolarArea 
                  data={marketData.demographics} 
                  options={radarChartOptions} 
                />
              </div>
            </DashboardCard>
          </>
        ) : (
          <>
            <DashboardCard title="Industry Trends" className="chart-card">
              <div className="chart-container">
                <Radar 
                  data={marketData.overview} 
                  options={radarChartOptions} 
                />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Growth Opportunities" className="chart-card">
              <div className="chart-container">
                <PolarArea 
                  data={marketData.opportunities} 
                  options={radarChartOptions} 
                />
              </div>
            </DashboardCard>
          </>
        )}
      </div>
      
      <DashboardCard 
        title="AI-Generated Forecasts" 
        className="forecasts-card"
        actions={
          <div className="forecast-actions">
            <button 
              className={selectedMetric === 'sales' ? 'active' : ''} 
              onClick={() => handleGenerateForecast('sales')}
              disabled={isForecastLoading}
            >
              Sales
            </button>
            <button 
              className={selectedMetric === 'engagement' ? 'active' : ''} 
              onClick={() => handleGenerateForecast('engagement')}
              disabled={isForecastLoading}
            >
              Engagement
            </button>
            <button 
              className={selectedMetric === 'inventory' ? 'active' : ''} 
              onClick={() => handleGenerateForecast('inventory')}
              disabled={isForecastLoading}
            >
              Inventory
            </button>
          </div>
        }
      >
        {isForecastLoading ? (
          <div className="forecast-loading">
            <div className="loading-spinner"></div>
            <p>Generating AI forecast...</p>
          </div>
        ) : forecast ? (
          <div className="forecast-content">
            <div className="forecast-header">
              <div className="forecast-title">
                <h3>{forecast.metric} Forecast</h3>
                <div className="forecast-metric">
                  <span className="metric-value">
                    {forecast.growth ? `+${forecast.growth}%` : forecast.depletion ? `-${forecast.depletion}%` : ''}
                  </span>
                  <span className="metric-period">over next {forecast.period === 'monthly' ? '6 months' : forecast.period === 'quarterly' ? '4 quarters' : '6 weeks'}</span>
                </div>
              </div>
              <div className="forecast-confidence">
                <div className="confidence-meter">
                  <div 
                    className="confidence-level" 
                    style={{ width: `${forecast.confidence}%` }}
                  ></div>
                </div>
                <span className="confidence-label">{forecast.confidence}% Confidence</span>
              </div>
            </div>
            
            <div className="forecast-chart">
              <Line 
                data={getForecastData()} 
                options={{
                  ...lineChartOptions,
                  plugins: {
                    ...lineChartOptions.plugins,
                    legend: {
                      ...lineChartOptions.plugins.legend,
                      display: false
                    }
                  }
                }} 
              />
            </div>
            
            <div className="forecast-factors">
              <h4>Influencing Factors</h4>
              <div className="factors-grid">
                {getForecastFactors().map((factor, index) => (
                  <div 
                    key={index} 
                    className={`factor-item ${factor.impact} ${factor.direction}`}
                  >
                    <div className="factor-name">{factor.name}</div>
                    <div className="factor-impact">
                      {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)} Impact
                    </div>
                    <div className="factor-direction">
                      <span className="direction-arrow">
                        {factor.direction === 'positive' ? '↑' : 
                         factor.direction === 'negative' ? '↓' : '⟷'}
                      </span>
                      {factor.direction.charAt(0).toUpperCase() + factor.direction.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-forecast">
            <p>Select a metric above to generate an AI-powered forecast.</p>
          </div>
        )}
      </DashboardCard>
      
      <DashboardCard title="Strategic Recommendations" className="recommendations-card">
        <div className="recommendations">
          {marketTrends.title.includes('Fragrance Industry') ? (
            <>
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Direct-to-Consumer Expansion</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  DTC channels show 15% higher margins than traditional retail. Allocate resources 
                  to strengthen direct sales through website optimization and exclusive online-only products.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Sustainable Packaging Transition</h3>
                  <div className="priority medium">Medium Priority</div>
                </div>
                <p>
                  Growing demand for sustainable packaging presents an opportunity to differentiate.
                  Develop a phased approach to transition to recycled and biodegradable materials.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Emerging Market Entry</h3>
                  <div className="priority medium">Medium Priority</div>
                </div>
                <p>
                  Southeast Asia and Middle East markets show strongest growth potential.
                  Focus on Dubai and Riyadh warehouses for logistics and develop targeted 
                  marketing for these regions.
                </p>
              </div>
            </>
          ) : marketTrends.title.includes('Competitor') ? (
            <>
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Brand Storytelling Enhancement</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  Top competitors differentiate through compelling brand narratives rather than price.
                  Invest in content that highlights MiN NEW YORK's unique story and fragrance creation process.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Limited Edition Strategy</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  Limited editions drive premium pricing and urgency. Develop quarterly limited releases 
                  tied to seasons or exclusive ingredients to boost margins and brand exclusivity.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Distribution Optimization</h3>
                  <div className="priority medium">Medium Priority</div>
                </div>
                <p>
                  Adjust channel mix to increase direct sales while maintaining strategic retail partners.
                  Target 45% direct sales within 12 months to align with industry leaders.
                </p>
              </div>
            </>
          ) : marketTrends.title.includes('Consumer') ? (
            <>
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Authenticity Marketing</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  78% of consumers value unique scent profiles, while 65% research brand ethics.
                  Develop marketing that highlights authentic ingredients, sustainable practices,
                  and the artisanal approach to fragrance creation.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>25-34 Age Group Targeting</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  Optimize marketing and product development for the 25-34 demographic (32%),
                  with a secondary focus on the quickly growing 18-24 segment (28%). Emphasize
                  digital channels and sophisticated storytelling.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Ethical Transparency Initiative</h3>
                  <div className="priority medium">Medium Priority</div>
                </div>
                <p>
                  Develop a comprehensive ESG report highlighting sustainable practices
                  and ethical ingredient sourcing to address the 65% of consumers who 
                  prioritize brand ethics in purchasing decisions.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Direct-to-Consumer Growth</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  Expand DTC channels through website optimization, mobile app development,
                  and exclusive direct offerings. Target 25% growth in direct sales over 12 months.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Middle East Market Penetration</h3>
                  <div className="priority high">High Priority</div>
                </div>
                <p>
                  Focus on expanding presence in the Middle East luxury market with
                  targeted marketing campaigns and strategic partnerships. Leverage
                  Dubai and Riyadh warehouses to improve delivery speed and customer experience.
                </p>
              </div>
              
              <div className="recommendation-item">
                <div className="recommendation-header">
                  <h3>Limited Edition Strategy</h3>
                  <div className="priority medium">Medium Priority</div>
                </div>
                <p>
                  Create quarterly limited edition releases to generate excitement and
                  premium pricing opportunities. Focus on unique ingredient stories and
                  sophisticated packaging to enhance brand exclusivity.
                </p>
              </div>
            </>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

export default MarketTrends;