import React from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaShoppingBag, 
  FaPercent, 
  FaUsers, 
  FaDollarSign, 
  FaBoxes,
  FaGlobe,
  FaIndustry,
  FaEye
} from 'react-icons/fa';
import '../../styles/StatCard.css';

const StatCard = ({ title, value, change, icon, className }) => {
  // Map string icon names to components
  const iconMap = {
    'chart-line': <FaChartLine />,
    'chart-bar': <FaChartBar />,
    'shopping-bag': <FaShoppingBag />,
    'percent': <FaPercent />,
    'users': <FaUsers />,
    'dollar-sign': <FaDollarSign />,
    'boxes': <FaBoxes />,
    'globe': <FaGlobe />,
    'industry': <FaIndustry />,
    'eye': <FaEye />
  };

  // Determine which icon to use
  const IconComponent = iconMap[icon] || <FaChartLine />;
  
  // Determine color based on change value
  const changeColor = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  
  // Format change with + or - sign
  const formattedChange = change > 0 ? `+${change}%` : `${change}%`;

  return (
    <div className={`stat-card ${className || ''}`}>
      <div className="stat-icon">
        {IconComponent}
      </div>
      <div className="stat-content">
        <h4 className="stat-title">{title}</h4>
        <div className="stat-value">{value}</div>
        {change !== undefined && (
          <div className={`stat-change ${changeColor}`}>
            {formattedChange}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;