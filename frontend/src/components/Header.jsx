import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import logo from "../assets/svvasthya_logo.svg";
import LoginModal from "./LoginModal";
import { useCookies } from 'react-cookie';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    if (cookies.token) {
      setIsLoggedIn(true);
    }
  }, [cookies]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
    removeCookie('token', { path: '/' });
    setIsLoggedIn(false);
    setIsAccountDropdownOpen(false);
  };

  return (
    <header className="relative flex  items-center h-24 p-4 bg-white  ">
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1 ml-3"
      >
        <div className="w-6 h-0.5 bg-[#282262]"></div>
        <div className="w-6 h-0.5 bg-[#282262]"></div>
        <div className="w-3 h-0.5 bg-[#282262]"></div>
      </button>

      <div className="logo ml-3 md:ml-11">
        <img
          src={logo}
          alt="Svasthya Logo"
          className="h-16 w-24 mt-1 animate-moveUpLogo delay-1000"
        />
      </div>

      <nav className={`hidden md:flex flex-1 justify-center`}>
        <ul className="flex list-none m-0 gap-6 p-0 text-2xl text-[#262163] font-normal">
          <li className="mx-4">
            <a
              href="#home"
              className="text-midnightblue font-inter-tight hover:border-b-2"
            >
              Home
            </a>
          </li>
          <li className="mx-4">
            <a
              href="/services"
              className="text-midnightblue font-inter-tight hover:border-b-2"
            >
              Services
            </a>
          </li>
          <li className="mx-4">
            <a
              href="#about"
              className="text-midnightblue font-inter-tight hover:border-b-2"
            >
              About us
            </a>
          </li>
          <li className="mx-4">
            <a
              href="#faqs"
              className="text-midnightblue font-inter-tight hover:border-b-2"
            >
              Svvasthya Saathi
            </a>
          </li>
          <li className="mx-4">
            <button
              onClick={handleAccountClick}
              className="relative text-midnightblue font-inter-tight hover:border-b-2 flex items-center"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            </button>
            {isAccountDropdownOpen && (
              <div className="absolute right-70 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-20">
                <ul className="list-none text-midnightblue">
                  <li>
                    <a href="/profile" className="block p-2 hover:bg-gray-200">
                      My Account
                    </a>
                  </li>
                  <li>
                    <a href="/bookings" className="block p-2 hover:bg-gray-200">
                      My Bookings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left p-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
            {/* Login Modal */}
            {showLoginModal && (
              <LoginModal
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
              />
            )}
          </li>
        </ul>
      </nav>

      <div className="emergency absolute right-4 bg-orange-600 text-center w-40 h-14 flex items-center justify-center rounded-md mr-3 md:mr-11 md:relative md:right-0">
        <a
          href="tel:+919998877777"
          className="emergency-call text-white font-normal text-sm"
        >
          Emergency Call
          <br />
          <span className="font-bold text-base">+91 99988 77777</span>
        </a>
      </div>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-10 w-3/4 md:hidden`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-2xl"
        >
          &times;
        </button>

        <div className="flex flex-col items-center mt-24 p-6">
          <ul className="flex flex-col list-none gap-6 text-2xl text-[#262163] font-normal">
            <li className="my-4">
              <a
                href="#home"
                className="text-midnightblue font-inter-tight hover:border-b-2"
                onClick={closeMenu}
              >
                Home
              </a>
            </li>
            <li className="my-4">
              <a
                href="#services"
                className="text-midnightblue font-inter-tight hover:border-b-2"
                onClick={closeMenu}
              >
                Services
              </a>
            </li>
            <li className="my-4">
              <a
                href="#about"
                className="text-midnightblue font-inter-tight hover:border-b-2"
                onClick={closeMenu}
              >
                About us
              </a>
            </li>
            <li className="my-4">
              <a
                href="#faqs"
                className="text-midnightblue font-inter-tight hover:border-b-2"
                onClick={closeMenu}
              >
                FAQS
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
