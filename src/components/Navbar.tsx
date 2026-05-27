import React from 'react';
import { TrendingUp, BarChart3, Briefcase, LayoutDashboard, Bot } from 'lucide-react';
import '../styles/Navbar.css';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: BarChart3 },
  { id: 'ai', label: 'AI Analysis', icon: Bot },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
];

const mobileTabs = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: BarChart3 },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
];

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => onTabChange('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-wrap">
              <TrendingUp className="logo-icon" size={22} />
            </div>
            <span>CryptoPulse</span>
            <span className="nav-badge">Pro</span>
          </div>
          <div className="nav-links">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="nav-right">
            <div className="nav-live-indicator">
              <span className="live-dot-pulse" />
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {mobileTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;