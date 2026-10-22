import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFlagUsa } from "react-icons/fa";

const languages = [
    { code: "uz", name: "O'zbek", flag: "fi-uz" },
    { code: "ru", name: "Русский", flag: "fi-ru" },
    { code: "en", name: "English", flag: "fi-gb" },
];

function LanguageFlag({ language, size = "text-xl" }) {
    if (language.code === "uz") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 64 64">
                <path d="M0 0h64v64H0z" fill="none" />
                <path fill="#42ade2" d="M32 2C19.3 2 8.5 9.9 4.1 21h55.8C55.5 9.9 44.7 2 32 2" />
                <path fill="#83bf4f" d="M32 62c12.7 0 23.5-7.9 27.9-19H4.1C8.5 54.1 19.3 62 32 62" />
                <path fill="#fff" d="M62 32c0-3.1-.5-6.2-1.4-9H3.4C2.5 25.8 2 28.9 2 32s.5 6.2 1.4 9h57.2c.9-2.8 1.4-5.9 1.4-9" />
                <g fill="#c94747">
                    <path d="M59.9 21c.1.3.3.7.4 1s.2.7.3 1" />
                    <path d="M60.3 22c-.1-.3-.3-.7-.4-1H4.1c-.1.3-.3.7-.4 1s-.2.7-.3 1h57.2c-.1-.3-.2-.7-.3-1M3.7 42c.1.3.3.7.4 1h55.8c.1-.3.3-.7.4-1s.2-.7.3-1H3.4c.1.3.2.7.3 1" />
                </g>
                <path fill="#fff" d="M20.4 17.3c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3c.6 0 1.1.1 1.6.3c-.8-.6-1.9-1-3-1c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.1 0 2.2-.4 3-1c-.5.2-1 .3-1.6.3m4.3-2.1l.4 1.1h1.1l-.9.6l.3 1.1l-.9-.7l-.9.7l.4-1.1l-.9-.6h1.1zm4.3 0l.3 1.1h1.2l-.9.6l.3 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.1zm4.3 0l.3 1.1h1.1l-.9.6l.4 1.1l-.9-.7l-1 .7l.4-1.1l-.9-.6h1.1zm4.2 0l.4 1.1H39l-.9.6l.3 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.2zm4.3 0l.3 1.1h1.2l-1 .6l.4 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.1zM29 11.6l.3 1.1h1.2l-.9.6l.3 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.1zm4.3 0l.3 1.1h1.1l-.9.6l.4 1.1l-.9-.7l-1 .7l.4-1.1l-.9-.6h1.1zm4.2 0l.4 1.1H39l-.9.6l.3 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.2zm4.3 0l.3 1.1h1.2l-1 .6l.4 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.1zM33.3 8l.3 1.1h1.1l-.9.6l.4 1.1l-.9-.7l-1 .7l.4-1.1l-.9-.6h1.1zm4.2 0l.4 1.1H39l-.9.6l.3 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.2zm4.3 0l.3 1.1h1.2l-1 .6l.4 1.1l-.9-.7l-.9.7l.3-1.1l-.9-.6h1.1z" />
            </svg>

        );
    }

    if (language.code === "ru") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <mask id="SVGqdEcMdXs">
                    <circle cx="256" cy="256" r="256" fill="#fff" />
                </mask>
                <g mask="url(#SVGqdEcMdXs)">
                    <path fill="#0052b4" d="M512 170v172l-256 32L0 342V170l256-32z" />
                    <path fill="#eee" d="M512 0v170H0V0Z" />
                    <path fill="#d80027" d="M512 342v170H0V342Z" />
                </g>
            </svg>


        );
    }
    if (language.code === "en") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <mask id="SVGqdEcMdXs">
                    <circle cx="256" cy="256" r="256" fill="#fff" />
                </mask>
                <g mask="url(#SVGqdEcMdXs)">
                    <path fill="#eee" d="M0 0h208l48 32l48-32h208v208l-32 48l32 48v208H304l-48-32l-48 32H0V304l32-48l-32-48Z" />
                    <path fill="#d80027" d="M208 0v208H0v96h208v208h96V304h208v-96H304V0z" />
                </g>
            </svg>



        );
    }

    return (
        <span
            aria-hidden="true"
            className={`fi ${language.flag} fis rounded-full ${size}`}
        />
    );
}

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const dropdownRef = useRef(null);

    const [isLangOpen, setIsLangOpen] = useState(false);

    const currentLangCode = i18n.resolvedLanguage || i18n.language || "uz";
    const currentLang =
        languages.find((item) => item.code === currentLangCode) || languages[0];

    const handleSelectLanguage = (newLangCode) => {
        if (newLangCode === currentLangCode) {
            setIsLangOpen(false);
            return;
        }

        i18n.changeLanguage(newLangCode);
        localStorage.setItem("lang", newLangCode);
        setIsLangOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="cursor-pointer px-2 py-0.5"
            >
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        <LanguageFlag language={currentLang} />
                        <span className="text-white">{currentLang.name}</span>
                    </div>
                    <div
                        className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : "rotate-0"}`}
                    >
                        <svg
                            aria-hidden="true"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className="text-white"
                        >
                            <path
                                d="m2 4.5 4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </button>
            {isLangOpen && (
                <div className="absolute top-full z-10 left-0 pt-2 w-32 shadow-lg overflow-hidden rounded-lg">
                    <div className="bg-light-second dark:bg-dark-second overflow-hidden rounded-lg">
                        {languages.map((item) => (
                            <button
                                key={item.code}
                                onClick={() => handleSelectLanguage(item.code)}
                                className={`cursor-pointer w-full px-3 py-2 flex items-center gap-2 overflow-hidden transition-colors duration-300 ${currentLangCode === item.code ? "bg-link-hover" : "hover:bg-link-hover/80"}`}
                            >
                                <LanguageFlag language={item} size="text-lg" />
                                <span className="text-lg">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
