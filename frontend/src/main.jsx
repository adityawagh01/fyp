import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import Order from "./pages/OrderPage/Order.jsx";
import MarkerMap from "./components/Map/MarkerMap.jsx";
import Admin from "./pages/Admin.jsx";
import Form from "./components/Form/Form"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user",
    element: <Form />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/success/:hub/:id",
    element: <Order />,
  },
  {
    path: "/showLoc",
    element : <MarkerMap/>,
  },
  {
    path: "/admin",
    element: <Admin />
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
