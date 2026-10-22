import React, { useState } from "react";
import "./header.css";
import { Icons } from "../../icons/icons";
import LanguageDropdown from "./Language";
import MenuBar from "../MenuBar/menuBar";
import HeaderModal from "./headerModol";

const Header = () => {
  const [isModal, setIsModal] = useState(false);

  return (
    <div className="wrap relative">
      {isModal && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setIsModal(false)}
        />
      )}

      <HeaderModal isModal={isModal} closeModal={() => setIsModal(false)} />

      <header className="container">
        <div className="header_top">
          <div className="header_left flex items-center gap-x-4">
            <div className="header_img w-22.5 h-17.5">
              <a href="/">
                <img src="/logo.png" alt="Khiva Museum" />
              </a>
            </div>

            <div className="header_360">
              <a
                href="https://khiva360.nazzar.uz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 text-white"
              >
                <Icons.vrIcon />
                <span>Khiva 360°</span>
              </a>
            </div>
            <div className="header_cart">
              <p className="text-white">Khiva Museum Shop</p>
            </div>
          </div>
          <div className="header_right flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsModal(true)}
              className="menu-trigger lg:hidden inline-flex items-center justify-center text-white"
              aria-label="Open menu"
            >
              <Icons.menuIcon className="w-6 h-6" />
            </button>

            <div className="header_socials flex items-center">
              <a
                href="https://www.youtube.com/@khivamuseaum.2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-2 py-0.5 text-white"
              >
                <Icons.youtubeIcon />
              </a>
              <a
                href="https://www.instagram.com/khivamuseumuzb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-2 py-0.5 text-white"
              >
                <Icons.instagramIcon />
              </a>
              <a
                href="mailto:info@khivamuseum.uz"
                className="inline-block px-2 py-0.5 text-white"
              >
                <Icons.mailIcon />
              </a>
              <a
                href="tel:+998556046343"
                className="flex items-center px-2 py-0.5 gap-1 text-white"
              >
                <Icons.phoneIcon />
                <span className="sp hidden lg:flex">+998556046343</span>
              </a>
            </div>
            <div className="header_language flex items-center gap-3">
              <div>
                <LanguageDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="menu_bar border-t border-[#995e12]">
        <div className="container">
          <MenuBar />
        </div>
      </div>
    </div>
  );
};

export default Header;