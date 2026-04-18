import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Methodology } from "./pages/Methodology";
import { SavedProjects } from "./pages/SavedProjects";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "methodology", Component: Methodology },
      { path: "saved", Component: SavedProjects },
    ],
  },
]);
