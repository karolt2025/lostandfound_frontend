import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LostAndFoundPage from "./pages/LostAndFoundPage.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import CreateItemPage from "./pages/CreateItem.jsx";

const router = createBrowserRouter([
  {
    path: "/",           // Root path
    element: <NavBar />, // NavBar is always visible
    children: [
      { path: "", element: <HomePage /> },            // matches "/"
      { path: "lostandfound", element: <LostAndFoundPage /> }, // matches "/lostandfound"
      { path: "login", element: <LoginPage /> },      // matches "/login"
      { path: "register", element: <RegisterPage /> },// matches "/register"
      { path: "create-item", element: <CreateItemPage /> }, // matches "/create-item"
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Here we wrap our app in the router provider so they render */}
    <RouterProvider router={router} />
  </React.StrictMode>
);