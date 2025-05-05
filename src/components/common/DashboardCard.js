import React from 'react';
import '../../styles/DashboardCard.css';

const DashboardCard = ({ title, children, className, actions }) => {
  return (
    <div className={`dashboard-card ${className || ''}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {actions && <div className="card-actions">{actions}</div>}
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;