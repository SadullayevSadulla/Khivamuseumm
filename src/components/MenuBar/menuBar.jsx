import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import LanguageDropdown from "../Header/Language";
import ProfileIcon from "./ProfileIcon";          
import useAuth from "../../hooks/useAuth";
import "./menuBar.css";
import { FaTicketAlt } from 'react-icons/fa';

const MenuBar = ({ isFixed = false }) => {
  const { t } = useTranslation();
  const { loggedIn } = useAuth();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const { pathname } = useLocation();

  const isRouteActive = (route) =>
    pathname === route || pathname.startsWith(`${route}/`);

  const isHomeActive = pathname === "/";
  const isAboutActive = isRouteActive("/about") || isRouteActive("/employees");
  const isCollectionsActive = isRouteActive("/collections");
  const isGalleryActive = isRouteActive("/gallery");
  const isNewsActive = isRouteActive("/news") || isRouteActive("/announcements");
  const isContactActive = isRouteActive("/contact");

  return (
    <div className="container1">
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center gap-x-7">
          <nav className="menu-nav flex items-center gap-13 py-2">
            <Link
              to={"/"}
              className={`menu-label uppercase leading-[110%] group relative ${isHomeActive ? "is-active" : ""}`}
            >
              {t("header.home")}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5! bg-link-hover origin-right transition-transform duration-300 ${isHomeActive ? "scale-x-100 origin-left" : "scale-x-0 group-hover:scale-x-100 group-hover:origin-left"}`}></span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button
                type="button"
                className={`menu-dropdown-trigger relative cursor-pointer h-full flex items-center gap-1 ${isAboutActive ? "is-active" : ""}`}
                onClick={() => setIsAboutOpen((prev) => !prev)}
                aria-expanded={isAboutOpen}
              >
                <span className="font-bold uppercase leading-[110%]">
                  {t("header.aboutus")}
                </span>
                <span
                  className={`transition-transform duration-200 ${isAboutOpen ? "rotate-180" : "rotate-0"}`}
                >
                  <Icons.downArrowIcon className="w-4.5 h-4.5" />
                </span>
              </button>
              {isAboutOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-46 pt-2 z-50">
                  <div className="w-full flex flex-col items-center bg-link-hover rounded-lg">
                    <Link
                      to={"/about"}
                      className="font-medium text-base leading-[130%] px-5 py-2 text-white"
                    >
                      {t("header.aboutTheMuseum")}
                    </Link>
                    <div className="h-px bg-white w-full"></div>
                    <Link
                      to={"/employees"}
                      className="font-medium text-base leading-[130%] px-5 py-2 text-white"
                    >
                      {t("header.employees")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to={"/collections"}
              className={`menu-label font-bold uppercase leading-[110%] group relative ${isCollectionsActive ? "is-active" : ""}`}
            >
              {t("header.museumCollection")}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5! bg-link-hover origin-right transition-transform duration-300 ${isCollectionsActive ? "scale-x-100 origin-left" : "scale-x-0 group-hover:scale-x-100 group-hover:origin-left"}`}></span>
            </Link>
            <Link
              to={"/gallery"}
              className={`menu-label font-bold uppercase leading-[110%] group relative ${isGalleryActive ? "is-active" : ""}`}
            >
              {t("header.gallery")}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5! bg-link-hover origin-right transition-transform duration-300 ${isGalleryActive ? "scale-x-100 origin-left" : "scale-x-0 group-hover:scale-x-100 group-hover:origin-left"}`}></span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsNewsOpen(true)}
              onMouseLeave={() => setIsNewsOpen(false)}
            >
              <button
                type="button"
                className={`menu-label menu-dropdown-trigger relative cursor-pointer h-full flex items-center gap-1 ${isNewsActive ? "is-active" : ""}`}
                onClick={() => setIsNewsOpen((prev) => !prev)}
                aria-expanded={isNewsOpen}
              >
                <span className="font-bold uppercase leading-[110%] menu-label">
                  {t("header.news")}
                </span>
                <span
                  className={`transition-transform duration-200 ${isNewsOpen ? "rotate-180" : "rotate-0"}`}
                >
                  <Icons.downArrowIcon className="w-4.5 h-4.5" />
                </span>
              </button>
              {isNewsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-45 pt-2 z-50">
                  <div className="w-full flex flex-col items-center bg-link-hover rounded-lg">
                    <Link
                      to={"/news"}
                      className="font-medium text-base leading-[130%] px-5 py-2 text-white"
                    >
                      {t("header.news")}
                    </Link>
                    <div className="h-px bg-white w-full"></div>
                    <Link
                      to={"/announcements"}
                      className="font-medium text-base leading-[130%] px-5 py-2 text-white"
                    >
                      {t("header.announcements")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to={"/contact"}
              className={`menu-label font-bold uppercase leading-[110%] group relative ${isContactActive ? "is-active" : ""}`}
            >
              {t("header.contact")}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5! bg-link-hover origin-right transition-transform duration-300 ${isContactActive ? "scale-x-100 origin-left" : "scale-x-0 group-hover:scale-x-100 group-hover:origin-left"}`}></span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-0.5">
          {isFixed ? (
            <LanguageDropdown />
          ) : (
            <>
              <div className="ticket-btn-wrap">
                <Link to={"/tickets"} className="ticket-btn">
                  <span>{t("header.aTickets")}</span>
                  <span className="ticket-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="none" stroke="currentColor" d="M17.5 4.23V8m0 2v4m0 2v3.77M.5 3.5v6a2.5 2.5 0 0 1 0 5v6H1l3.04-.434a56.3 56.3 0 0 1 15.92 0L23 20.5h.5v-6a2.5 2.5 0 0 1 0-5v-6H23l-3.04.434a56.3 56.3 0 0 1-15.92 0L1 3.5z" />
</svg>

                  </span>
                </Link>
              </div>
              <div className="login-btn-wrap">
                <Link to={loggedIn ? "/profile" : "/login"} className="login-btn">
                  <span className="login-btn-icon">
                    <ProfileIcon size={44} />
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuBar