import Galereya from "./Galereya/galereya"
import { HeaderInfo } from "./HeaderInfo/headerInfo"
import { Main } from "./Main/main"
import { MainM } from "./mainM/mainM"
import MainTez from "./MainTez/mainTez"
import News from "./news/news"

export const Home = () => {
  return (
    <>
      <HeaderInfo />
      <Main />
      <MainTez/>
      <MainM/>
      <Galereya/>
      <News showDetails />
    </>
  )
}
