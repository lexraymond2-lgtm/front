import React, { useState } from 'react';
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaChartBar, 
  FaEnvelope, 
  FaBars, 
  FaTimes,
  FaSearch,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';
import styles from './sidebarite.module.css';
import heinzads from "../assets/heinz.png"
import times from "../assets/times.jpg"

const defaultMenuItems = [
  { label: 'Home', icon: FaHome, href: '/', active: true },
  { label: 'Profile', icon: FaUser, href: '/profile' },
  { label: 'About AMG Retro', icon: FaChartBar, href: '/about' },
  { label: 'Messages', icon: FaEnvelope, href: '/messages' },
  { label: 'Settings', icon: FaCog, href: '/settings' },
];

const SideBart = ({
  menuItems = defaultMenuItems,
  brandName = 'AMG RETRO',
  onMenuClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (item) => {
    if (onMenuClick) {
      onMenuClick(item);
    }
    // Close mobile menu after click
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className={styles.mobileToggle}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${isCollapsed ? styles.collapsed : ''} ${className}`}>
        {/* Header */}
        <div className={styles.header}>
          
          {/* Desktop Collapse Button */}
          <button
            className={styles.collapseBtn}
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
          >
            <FaBars />
          </button>
        </div>

        <div className={styles.firstAds}>
          <img className={styles.firstAdsimg} src={heinzads} alt="" />
        </div>
        <div className={styles.firstAds}>
          <img className={styles.firstAdsimg} src={times} alt="" />
        </div>
      </aside>
    </>
  );
};

export default SideBart;