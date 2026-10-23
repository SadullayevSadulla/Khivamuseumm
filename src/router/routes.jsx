import { Home } from "../pages/Home/home";
import NewsDetails from "../pages/Home/NewsDetails/NewsDetails";

export const router = [
    {
        id:1,
        path:"/",
        element:<Home/>
    },
    {
        id:2,
        path:"/news/:newsDetails",
        element:<NewsDetails/>
    },
]