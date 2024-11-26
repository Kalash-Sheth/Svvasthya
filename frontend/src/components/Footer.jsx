import React from "react";
import footerlogo from "../assets/footerlogo.svg";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const FooterSection = ({ title, links }) => (
  <div>
    <p className="font-bold text-xl text-white mb-6">{title}</p>
    <ul className="space-y-4 text-lg font-normal">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.url} className="text-white transition hover:opacity-75">
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ Icon, url, label }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white hover:text-orange-500 transition-colors duration-300"
    aria-label={label}
  >
    <Icon className="w-6 h-6" />
  </a>
);

function Footer() {
  const sections = {
    services: {
      title: "Services",
      links: [
        { text: "Nursing Care", url: "#" },
        { text: "Elder Care", url: "#" },
        { text: "Baby Care", url: "#" },
        { text: "Physiotherapy", url: "#" },
        { text: "Medical Equipment", url: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { text: "About Us", url: "#" },
        { text: "Meet the Team", url: "#" },
        { text: "Our Mission", url: "#" },
      ],
    },
    helpfulLinks: {
      title: "Helpful Links",
      links: [
        { text: "Contact Us", url: "#" },
        { text: "FAQs", url: "#" },
        { text: "Terms & Conditions", url: "#" },
        { text: "Privacy Policy", url: "#" },
      ],
    },
  };

  return (
    <footer className="bg-[#282261] mt-12 w-full max-w-[1720px] rounded-t-3xl">
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Info Section */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="text-white">
              <img
                src={footerlogo}
                alt="Swasthya Logo"
                className="w-52 h-auto mb-6"
              />
            </div>
            <p className="text-white text-lg mb-4">
              Providing comprehensive healthcare support services at your
              doorstep
            </p>
            <div className="space-y-2">
              <p className="text-white text-lg font-bold">Contact Us</p>
              <p className="text-white">info@swasthya.com</p>
              <p className="text-white">+91 98765 43210</p>
            </div>
          </div>

          {/* Services Section */}
          <FooterSection
            title={sections.services.title}
            links={sections.services.links}
          />

          {/* Company Section */}
          <FooterSection
            title={sections.company.title}
            links={sections.company.links}
          />

          {/* Helpful Links and Social Media */}
          <div>
            <FooterSection
              title={sections.helpfulLinks.title}
              links={sections.helpfulLinks.links}
            />
            <div className="mt-8">
              <p className="font-bold text-xl text-white mb-6">Follow Us</p>
              <div className="flex gap-6">
                <SocialIcon Icon={FaFacebook} url="#" label="Facebook" />
                <SocialIcon Icon={FaInstagram} url="#" label="Instagram" />
                <SocialIcon Icon={FaTwitter} url="#" label="Twitter" />
                <SocialIcon Icon={FaLinkedin} url="#" label="LinkedIn" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white">
            © {new Date().getFullYear()} Swasthya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
