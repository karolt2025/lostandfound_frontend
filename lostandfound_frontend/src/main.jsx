import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LostAndFoundPage from "./pages/LostAndFoundPage.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import CreateItemPage from "./pages/CreateItem.jsx";
import ItemDetailPage from "./pages/ItemDetail.jsx"; // 👈 ADD THIS

const router = createBrowserRouter([
  {
    path: "/",           // Root layout
    element: <NavBar />, // NavBar always visible
    children: [
      { path: "", element: <HomePage /> },                 // "/"
      { path: "lostandfound", element: <LostAndFoundPage /> }, // "/lostandfound"
      { path: "items/:id", element: <ItemDetailPage /> },  // ✅ "/items/4"
      { path: "login", element: <LoginPage /> },           // "/login"
      { path: "register", element: <RegisterPage /> },     // "/register"
      { path: "create-item", element: <CreateItemPage /> },// "/create-item"
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
