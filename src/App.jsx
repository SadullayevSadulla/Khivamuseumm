import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/footer";
import Header from "./components/Header/header";
import { router } from "./router/routes";
const App = () => {
  return (
    <>
      <Header />
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
    </>
  )
}

export default App;