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
  const previousLocationKey = useRef(location.key);

  useEffect(() => {
    if (previousLocationKey.current === location.key) return;

    previousLocationKey.current = location.key;
    setIsPageLoading(true);
    const timeoutId = window.setTimeout(() => setIsPageLoading(false), 350);

    return () => window.clearTimeout(timeoutId);
  }, [location.key]);

  return (
    <>
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