import About from "../pages/About/about";
import Announcements from "../pages/Announcements/announcements";
import AnnouncementDetails from "../pages/Announcements/AnnouncementDetails";
import Collactions from "../pages/collections/collactions";
import Employees from "../pages/Employees/employees";
import Gallery from "../pages/gallery/gallery";
import { Home } from "../pages/Home/home";
import News from "../pages/Home/news/news";
import NewsDetails from "../pages/Home/NewsDetails/NewsDetails";

export const router = [
    {
        id: 1,
        path: "/",
        element: <Home />
    },
    {
        id: 2,
        path: "/news/:newsDetails",
        element: <NewsDetails />
    },
    {
        id: 3,
        path: "/news",
        element: <News />
    },
    {
        id: 4,
        path: "/about",
        element: <About />
    },
    {
        id: 5,
        path: "/employees",
        element: <Employees />
    },
    {
        id: 6,
        path: "/collections",
        element: <Collactions />
    },
    {
        id: 7,
        path: "/gallery",
        element: <Gallery />
    },
    {
        id: 8,
        path: "/announcements/:announcementDetails",
        element: <AnnouncementDetails />
    },
    {
        id: 9,
        path: "/announcements",
        element: <Announcements />
    }
]