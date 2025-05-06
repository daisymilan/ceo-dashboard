import React, { useState } from 'react';
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
import {FaChartLine, FaUsers} from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import DashboardCard from './common/DashboardCard';
import StatCard from './common/StatCard';
import '../styles/SocialMediaMetrics.css';

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

const SocialMediaMetrics = () => {
  const { 
    socialMetrics, 
    loadingSocial, 
    socialPlatform, 
    setSocialPlatform 
  } = useData();
  
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Handle platform change
  const handlePlatformChange = (platform) => {
    setSocialPlatform(platform);
  };
  
  // Handle post selection
  const handlePostSelect = (post) => {
    setSelectedPost(post === selectedPost ? null : post);
  };
  
  if (loadingSocial || !socialMetrics) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading social media metrics...</p>
      </div>
    );
  }
  
  // Get platform-specific data
  const getPlatformData = () => {
    if (socialPlatform === 'instagram') {
      return socialMetrics.instagram;
    } else if (socialPlatform === 'tiktok') {
      return socialMetrics.tiktok;
    } else {
      return socialMetrics.summary;
    }
  };
  
  const platformData = getPlatformData();
  
  // Get audience growth data for chart
  const getAudienceGrowthData = () => {
    if (socialPlatform === 'all') {
      // Combine data for both platforms
      const instagramData = socialMetrics.instagram.audienceGrowth;
      const tiktokData = socialMetrics.tiktok.audienceGrowth;
      
      return {
        labels: instagramData.map(item => {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: 'Instagram',
            data: instagramData.map(item => item.followers),
            borderColor: '#E1306C',
            backgroundColor: 'rgba(225, 48, 108, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'TikTok',
            data: tiktokData.map(item => item.followers),
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    } else {
      const data = platformData.audienceGrowth;
      
      return {
        labels: data.map(item => {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: 'Followers',
            data: data.map(item => item.followers),
            borderColor: socialPlatform === 'instagram' ? '#E1306C' : '#000000',
            backgroundColor: socialPlatform === 'instagram' ? 'rgba(225, 48, 108, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    }
  };
  
  // Get engagement data for chart
  const getEngagementData = () => {
    if (socialPlatform === 'all') {
      // Combine data from both platforms by content type
      const instagramData = socialMetrics.instagram.contentTypes;
      const tiktokData = socialMetrics.tiktok.contentTypes;
      
      // Merge content types
      const contentTypes = [...new Set([
        ...Object.keys(instagramData),
        ...Object.keys(tiktokData)
      ])];
      
      return {
        labels: contentTypes,
        datasets: [
          {
            label: 'Instagram',
            data: contentTypes.map(type => 
              instagramData[type] ? instagramData[type].engagementRate : 0
            ),
            backgroundColor: 'rgba(225, 48, 108, 0.7)'
          },
          {
            label: 'TikTok',
            data: contentTypes.map(type => 
              tiktokData[type] ? tiktokData[type].engagementRate : 0
            ),
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }
        ]
      };
    } else {
      const data = platformData.contentTypes;
      
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: 'Engagement Rate (%)',
            data: Object.values(data).map(type => type.engagementRate),
            backgroundColor: socialPlatform === 'instagram' ? 
              'rgba(225, 48, 108, 0.7)' : 'rgba(0, 0, 0, 0.7)'
          }
        ]
      };
    }
  };
  
  // Get demographics data for chart
  const getDemographicsData = () => {
    const data = platformData.demographics || 
      (socialPlatform === 'all' ? socialMetrics.instagram.demographics : platformData.demographics);
    
    return {
      ageGroups: {
        labels: Object.keys(data.ageGroups),
        datasets: [
          {
            data: Object.values(data.ageGroups),
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
      },
      genders: {
        labels: Object.keys(data.genders).map(g => g.charAt(0).toUpperCase() + g.slice(1)),
        datasets: [
          {
            data: Object.values(data.genders),
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }
        ]
      }
    };
  };
  
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
        beginAtZero: false,
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
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  // Get top posts based on platform
  const getTopPosts = () => {
    if (socialPlatform === 'instagram') {
      return socialMetrics.instagram.topPosts;
    } else if (socialPlatform === 'tiktok') {
      return socialMetrics.tiktok.topVideos;
    } else {
      // Combine and sort by engagement
      return [
        ...socialMetrics.instagram.topPosts,
        ...socialMetrics.tiktok.topVideos
      ].sort((a, b) => b.engagement - a.engagement).slice(0, 3);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Platform icon
  const getPlatformIcon = (postId) => {
    if (postId.startsWith('ig')) {
      return <FaInstagram className="platform-icon instagram" />;
    } else if (postId.startsWith('tt')) {
      return <FaTiktok className="platform-icon tiktok" />;
    }
    return null;
  };
  
  return (
    <div className="social-media-metrics">
      <div className="page-header">
        <h2>Social Media Metrics</h2>
        <div className="platform-selector">
          <button 
            className={socialPlatform === 'all' ? 'active' : ''} 
            onClick={() => handlePlatformChange('all')}
          >
            All Platforms
          </button>
          <button 
            className={socialPlatform === 'instagram' ? 'active instagram' : 'instagram'} 
            onClick={() => handlePlatformChange('instagram')}
          >
            <FaInstagram /> Instagram
          </button>
          <button 
            className={socialPlatform === 'tiktok' ? 'active tiktok' : 'tiktok'} 
            onClick={() => handlePlatformChange('tiktok')}
          >
            <FaTiktok /> TikTok
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        {socialPlatform === 'all' ? (
          <>
            <StatCard 
              title="Total Followers" 
              value={platformData.totalFollowers.toLocaleString()} 
              change={5.2} // Average growth rate
              icon="users"
            />
            <StatCard 
              title="Total Engagement" 
              value={platformData.totalEngagement.toLocaleString()} 
              change={7.8} // Average engagement growth
              icon="chart-line"
            />
            <StatCard 
              title="Engagement Rate" 
              value={`${platformData.engagementRate}%`} 
              change={1.1} // Average engagement rate change
              icon="chart-bar"
            />
            <StatCard 
              title="Top Platform" 
              value={platformData.topPlatform} 
              icon="chart-bar"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Followers" 
              value={platformData.followers.toLocaleString()} 
              change={platformData.followersChange} 
              icon="users"
            />
            <StatCard 
              title="Engagement" 
              value={platformData.engagement.toLocaleString()} 
              change={platformData.engagementChange} 
              icon="chart-line"
            />
            <StatCard 
              title="Engagement Rate" 
              value={`${platformData.engagementRate}%`} 
              change={platformData.engagementRateChange} 
              icon="chart-bar"
            />
            <StatCard 
              title={socialPlatform === 'instagram' ? 'Reach' : 'Views'} 
              value={socialPlatform === 'instagram' ? 
                platformData.reachLastMonth.toLocaleString() : 
                platformData.viewsLastMonth.toLocaleString()} 
              change={socialPlatform === 'instagram' ? 
                platformData.reachChange : 
                platformData.viewsChange} 
              icon="eye"
            />
          </>
        )}
      </div>
      
      <div className="charts-grid">
        <DashboardCard title="Audience Growth" className="chart-card large">
          <div className="chart-container">
            <Line 
              data={getAudienceGrowthData()} 
              options={lineChartOptions} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Content Performance by Type" className="chart-card">
          <div className="chart-container">
            <Bar 
              data={getEngagementData()} 
              options={barChartOptions} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Age Demographics" className="chart-card">
          <div className="chart-container doughnut-container">
            <Doughnut 
              data={getDemographicsData().ageGroups} 
              options={doughnutChartOptions} 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title="Gender Demographics" className="chart-card">
          <div className="chart-container doughnut-container">
            <Doughnut 
              data={getDemographicsData().genders} 
              options={doughnutChartOptions} 
            />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard title="Top Performing Content" className="post-list-card">
        <div className="post-list">
          {getTopPosts().map(post => (
            <div 
              key={post.id} 
              className={`post-item ${selectedPost === post.id ? 'selected' : ''}`}
              onClick={() => handlePostSelect(post.id)}
            >
              <div className="post-thumbnail">
                <div className="thumbnail-placeholder">
                  {/* In a real implementation, this would be an actual image */}
                  <div className="thumbnail-label">{post.thumbnail.split('.')[0]}</div>
                  {getPlatformIcon(post.id)}
                </div>
              </div>
              <div className="post-details">
                <div className="post-caption">{post.caption}</div>
                <div className="post-metrics">
                  <div className="metric">
                    <FaThumbsUp /> {post.likes.toLocaleString()}
                  </div>
                  <div className="metric">
                    <FaEye /> {(post.reach || post.views).toLocaleString()}
                  </div>
                  <div className="post-date">{formatDate(post.date)}</div>
                </div>
              </div>
              <div className="post-engagement">
                <div className="engagement-value">{post.engagement.toLocaleString()}</div>
                <div className="engagement-label">Engagement</div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
      
      {socialPlatform === 'all' && (
        <DashboardCard title="Strategy Insights" className="strategy-card">
          <div className="strategy-section">
            <h3>Audience Insights</h3>
            <p>
              Primary audience is 25-34 year olds (38%) with strong engagement from the 18-24 (35%) demographic on TikTok.
              Women account for 56-60% of the audience across platforms, with higher engagement rates than male followers.
            </p>
          </div>
          
          <div className="strategy-section">
            <h3>Content Strategy</h3>
            <p>
              <strong>Top Performing Content:</strong> {platformData.mostEngagingContent}
            </p>
            <p>
              <strong>Recommended Strategy:</strong> {platformData.recommendedStrategy}
            </p>
          </div>
          
          <div className="strategy-action-buttons">
            <button className="action-btn primary">
              <FaInstagram /> Schedule Instagram Post
            </button>
            <button className="action-btn primary">
              <FaTiktok /> Schedule TikTok Video
            </button>
            <button className="action-btn secondary">
              View Content Calendar
            </button>
          </div>
        </DashboardCard>
      )}
    </div>
  );
};

export default SocialMediaMetrics;