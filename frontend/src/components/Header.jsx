import { faUser, faCalendar, faSignOutAlt, faHome, faList, faInfoCircle, faUsers, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/svvasthya_logo.svg";
import LoginModal from "./LoginModal";
import { useCookies } from "react-cookie";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (cookies.token) {
      setIsLoggedIn(true);
    }
  }, [cookies]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setIsAccountDropdownOpen(!isAccountDropdownOpen);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    setIsLoggedIn(false);
    setIsAccountDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center transform hover:scale-105 transition-transform duration-300"
          >
            <img src={logo} alt="Svasthya Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/services" className="nav-link">
              Services
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/saathi" className="nav-link">
              Svvasthya Saathi
            </Link>

            {/* Account Icon and Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleAccountClick}
                className="p-2 rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#EF5A2A] flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-white text-sm"
                  />
                </div>
              </button>

              {/* Account Dropdown */}
              <AnimatePresence>
                {isAccountDropdownOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-[#282261]">Welcome!</div>
                      <div className="text-xs text-gray-500">Manage your account</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="account-menu-item group"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#EF5A2A]/10 flex items-center justify-center mr-3 group-hover:bg-[#EF5A2A]/20">
                            <FontAwesomeIcon icon={faUser} className="text-[#EF5A2A] text-sm" />
                          </div>
                          <span>My Profile</span>
                        </div>
                      </Link>

                      <Link 
                        to="/bookings" 
                        className="account-menu-item group"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#282261]/10 flex items-center justify-center mr-3 group-hover:bg-[#282261]/20">
                            <FontAwesomeIcon icon={faCalendar} className="text-[#282261] text-sm" />
                          </div>
                          <span>My Bookings</span>
                        </div>
                      </Link>

                      <button 
                        onClick={handleLogout}
                        className="account-menu-item group w-full"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 group-hover:bg-red-500/20">
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500 text-sm" />
                          </div>
                          <span className="text-red-500">Logout</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Emergency Button */}
            <a
              href="tel:+919998877777"
              className="emergency-button"
            >
              <span className="block text-sm">Emergency Call</span>
              <span className="block font-bold">+91 99988 77777</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <div
              className={`w-6 h-0.5 bg-[#282261] transition-all duration-300 ${
                isMenuOpen ? "transform rotate-45 translate-y-1.5" : "mb-1"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-[#282261] transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "mb-1"
              }`}
            ></div>
            <div
              className={`w-4 h-0.5 bg-[#282261] transition-all duration-300 ${
                isMenuOpen
                  ? "transform -rotate-45 -translate-y-1.5 w-6"
                  : "ml-2"
              }`}
            ></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-20 right-0 h-screen w-[80%] max-w-sm bg-white shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* User Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gray-50 border-b"
                  >
                    {isLoggedIn ? (
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-12 rounded-full bg-[#EF5A2A] flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
                        </motion.div>
                        <div>
                          <div className="text-[#282261] font-medium">Welcome!</div>
                          <div className="text-sm text-gray-500">Manage your account</div>
                        </div>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowLoginModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-3 bg-[#EF5A2A] text-white rounded-lg font-medium hover:bg-[#282261] transition-colors"
                      >
                        Login / Sign Up
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Navigation Links */}
                  <motion.div 
                    className="flex-1 overflow-y-auto py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      { to: "/", icon: faHome, text: "Home" },
                      { to: "/services", icon: faList, text: "Services" },
                      { to: "/about", icon: faInfoCircle, text: "About Us" },
                      { to: "/saathi", icon: faUsers, text: "Svvasthya Saathi" },
                    ].map((link, index) => (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Link
                          to={link.to}
                          className="mobile-menu-link group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center"
                          >
                            <FontAwesomeIcon icon={link.icon} className="w-5 h-5 group-hover:text-[#EF5A2A] transition-colors" />
                            <span>{link.text}</span>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}

                    {isLoggedIn && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="border-t my-2"></div>
                        {[
                          { to: "/profile", icon: faUser, text: "My Profile", color: "text-[#EF5A2A]" },
                          { to: "/bookings", icon: faCalendar, text: "My Bookings", color: "text-[#282261]" },
                        ].map((link, index) => (
                          <motion.div
                            key={link.to}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <Link
                              to={link.to}
                              className="mobile-menu-link group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center"
                              >
                                <FontAwesomeIcon icon={link.icon} className={`w-5 h-5 ${link.color}`} />
                                <span>{link.text}</span>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}

                        <motion.button
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 }}
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="mobile-menu-link text-left w-full group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
                            <span className="text-red-500">Logout</span>
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Emergency Contact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="p-6 bg-gray-50 border-t"
                  >
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="tel:+919998877777"
                      className="flex items-center space-x-3 text-[#EF5A2A]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
                      <div>
                        <div className="text-sm">Emergency Call</div>
                        <div className="font-bold">+91 99988 77777</div>
                      </div>
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      <style jsx>{`
        .nav-link {
          color: #282261;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 0.5rem;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #ef5a2a;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #ef5a2a;
        }
        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #282261;
          transition: all 0.3s ease;
          transform-origin: top;
        }
        .dropdown-item:hover {
          background-color: #f3f4f6;
          color: #ef5a2a;
          padding-left: 1.5rem;
        }
        .mobile-nav-link {
          padding: 1rem;
          color: #282261;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          transform: translateX(0);
        }
        .mobile-nav-link:hover {
          background-color: #f3f4f6;
          color: #ef5a2a;
          transform: translateX(10px);
        }
        .emergency-button {
          background-color: #ef5a2a;
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(239, 90, 42, 0.1);
        }
        .emergency-button:hover {
          background-color: #282261;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(40, 34, 97, 0.2);
        }
        .account-menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #282261;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        .account-menu-item:hover {
          background-color: #f8f9fa;
          padding-left: 1.25rem;
        }
        .account-menu-item span {
          transition: all 0.2s ease;
        }
        .account-menu-item:hover span {
          transform: translateX(4px);
        }
        .mobile-menu-link {
          display: flex;
          align-items: center;
          padding: 0.875rem 1.5rem;
          color: #282261;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .mobile-menu-link span {
          margin-left: 1rem;
        }
        .mobile-menu-link:hover {
          background-color: #f8f9fa;
          color: #EF5A2A;
          padding-left: 2rem;
        }
        .mobile-menu-link:active {
          background-color: #f3f4f6;
        }
      `}</style>
    </header>
  );
};

export default Header;
