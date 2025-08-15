import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaSignOutAlt,
  FaFlask,
  FaFilter,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import styles from "./sidebar.module.css";

// Icon mapping object
const iconMap = {
  FaHome,
  FaUser,
  FaCog,
  FaChartBar,
  FaEnvelope,
  FaFlask,
};

const defaultMenuItems = [
  { label: "Home", icon: FaHome, href: "/", active: true },
  { label: "Profile", icon: FaUser, href: "/profile" },
  { label: "About AMG Retro", icon: FaChartBar, href: "/about" },
  // { label: "Messages", icon: FaEnvelope, href: "/messages" },
  // { label: "Resources", icon: FaFlask, href: "/settings" },
];

const SideBar = ({
  menuItems = defaultMenuItems,
  brandName = "AMG RETRO",
  onMenuClick,
  className = "",
  showSearch = false,
  searchTerm = "",
  onSearchChange = () => {},
  filterCategory = "all",
  onFilterChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

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

  const navigate = useNavigate()

  // Process menu items to handle both string and component icons
  const processedMenuItems = menuItems.map(item => ({
    ...item,
    icon: typeof item.icon === 'string' ? iconMap[item.icon] : item.icon
  }));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar} />}

      {/* Mobile Toggle Button */}
      <button
        className={styles.mobileToggle}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${
          isCollapsed ? styles.collapsed : ""
        } ${className}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <FaChartBar />
            </div>
            {!isCollapsed && (
              <span className={styles.brandText}>{brandName}</span>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            className={styles.collapseBtn}
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
          >
            <FaBars />
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && showSearch && (
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search posts..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        )}

       

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {processedMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index} className={styles.menuItem}>
                  <Link
                    to={item.href}
                    className={`${styles.menuLink} ${
                      item.active ? styles.active : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                    title={isCollapsed ? item.label : ""}
                  >
                    <IconComponent className={styles.menuIcon} />
                    {!isCollapsed && (
                      <span className={styles.menuLabel}>{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

           {/* Filter Controls */}
        {!isCollapsed && showSearch && (
          <div className={styles.filterContainer}>
            <FaFilter className={styles.filterIcon} />
            <select
              value={filterCategory}
              onChange={onFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              <option value="games">Games</option>
              <option value="movies">Movies</option>
              <option value="anime">Anime</option>
            </select>
          </div>
        )}

        {/* Active Filter Display */}
        {!isCollapsed && showSearch && filterCategory !== 'all' && (
          <div className={styles.activeFilter}>
            <span></span>
            <button 
              className={styles.clearFilterBtn}
              onClick={() => onFilterChange({ target: { value: 'all' } })}
            >
              
            </button>
          </div>
        )}
        </nav>
        

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          {isLoggedIn ? (
            // Show logout button when user is logged in
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
              }}
              className={styles.actionBtn}
              title={isCollapsed ? "Logout" : ""}
            >
              <FaSignOutAlt className={styles.actionIcon} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          ) : (
            // Show login and sign up buttons when user is not logged in
            <>
              <Link
                to="/login"
                className={styles.actionBtn}
                title={isCollapsed ? "Login" : ""}
              >
                <FaSignInAlt className={styles.actionIcon} />
                {!isCollapsed && <span>Login</span>}
              </Link>
              <Link
                to="/signup"
                className={styles.actionBtn}
                title={isCollapsed ? "Sign Up" : ""}
              >
                <FaUserPlus className={styles.actionIcon} />
                {!isCollapsed && <span>Sign Up</span>}
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
