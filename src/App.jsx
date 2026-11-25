import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer/footer";
import Header from "./components/Header/header";
import AppBreadcrumb from "./components/Breadcrumb/AppBreadcrumb";
import Loader from "./components/Loader/loader";
import { router } from "./router/routes";

const App = () => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showEntrance, setShowEntrance] = useState(() => location.pathname === '/');
  const [isEntranceLeaving, setIsEntranceLeaving] = useState(false);
  const previousLocationKey = useRef(location.key);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowEntrance(false);
      setIsEntranceLeaving(false);
      return;
    }

    setShowEntrance(true);
    setIsEntranceLeaving(false);
    const leaveTimer = window.setTimeout(() => setIsEntranceLeaving(true), 1750);
    const hideTimer = window.setTimeout(() => setShowEntrance(false), 2550);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (previousLocationKey.current === location.key) return;

    previousLocationKey.current = location.key;

    if (location.pathname !== '/') {
      setIsPageLoading(false);
      return;
    }

    setIsPageLoading(true);
    const timeoutId = window.setTimeout(() => setIsPageLoading(false), 350);

    return () => window.clearTimeout(timeoutId);
  }, [location.key, location.pathname]);

  useEffect(() => {
    const clearRevealClasses = () => {
      document.querySelectorAll("main .scroll-reveal").forEach((element) => {
        element.classList.remove("scroll-reveal", "scroll-reveal--visible");
        element.style.removeProperty("--reveal-index");
      });

      if (window.__scrollRevealObserver) {
        window.__scrollRevealObserver.disconnect();
        delete window.__scrollRevealObserver;
      }
    };

    clearRevealClasses();

    if (location.pathname !== '/') return;

    let observer;
    let mutationObserver;

    const noRevealRoutes = [
      '/about', '/collections', '/contact', '/gallery', '/employees',
      '/announcements', '/news', '/tickets', '/profile', '/login', '/register', '/verify'
    ];
    const isNoRevealRoute = noRevealRoutes.some((route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    if (isNoRevealRoute) return;

    const setupReveal = () => {
      const main = document.querySelector("main");
      if (!main) return;

      const candidates = main.querySelectorAll(
        "section, article, [data-reveal], main > *, " +
        "[class*='card'], [class*='Card'], [class*='item'], [class*='grid'] > *"
      );

      const revealElements = [...new Set(candidates)].filter((element) => {
        if (element.closest(".site-entrance, .page-transition-loader")) return false;
        if (element.closest(
          ".gallery-mosaic, .gallery-grid, .gallery-left, .gallery-right, .gallery-middle, " +
          ".contact-section, .contact, .collections-page, .hodimlar, .hodimlarr, " +
          ".announcements-page, .announcements-grid, .main_fix, .container2"
        )) return false;
        return !element.classList.contains("scroll-reveal") && element.offsetParent !== null;
      });

      revealElements.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-index", String(Math.min(index % 4, 3)));

        if (!("IntersectionObserver" in window)) {
          element.classList.add("scroll-reveal--visible");
        } else if (observer) {
          observer.observe(element);
        }
      });
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("scroll-reveal--visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );

      window.__scrollRevealObserver = observer;
    }

    const frameId = window.requestAnimationFrame(setupReveal);
    const retryId = window.setTimeout(setupReveal, 400);

    const main = document.querySelector("main");
    if (main && "MutationObserver" in window) {
      mutationObserver = new MutationObserver(() => setupReveal());
      mutationObserver.observe(main, { childList: true, subtree: true });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(retryId);
      mutationObserver?.disconnect();
      if (observer) {
        observer.disconnect();
        if (window.__scrollRevealObserver === observer) {
          delete window.__scrollRevealObserver;
        }
      }
    };
  }, [location.pathname]);

  return (
    <>
      {showEntrance && (
        <div
          className={`site-entrance ${isEntranceLeaving ? "is-leaving" : ""}`}
          role="presentation"
          aria-hidden="true"
        >
          <div className="site-entrance__glow" />
          <div className="site-entrance__pattern" />
          <div className="site-entrance__brand">
            <span className="site-entrance__line site-entrance__line--left" />
            <img src="/logo.png" alt="" />
            <span className="site-entrance__line site-entrance__line--right" />
          </div>
          <p className="site-entrance__title">Khiva Museum</p>
          <div className="site-entrance__progress"><span /></div>
        </div>
      )}
      <Header />
      <AppBreadcrumb />
      <main>
        <Routes>
          {router.map((item) => (
            <Route
              key={item.id}
              path={item.path}
              element={item.element}
            />
          ))}
        </Routes>
      </main>
      <Footer />
      {isPageLoading && (
        <div className="page-transition-loader" role="status" aria-label="Sahifa yuklanmoqda">
          <Loader fullHeight={false} />
        </div>
      )}
    </>
  )
}

export default App;