import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LostAndFoundPage from "./pages/LostAndFoundPage.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import CreateItemPage from "./pages/CreateItem.jsx";
import ItemDetailPage from "./pages/ItemDetail.jsx"; 
import EditItem from "./pages/EditItem";
import ContactOwner from "./pages/ContactOwner";
import Inbox from "./pages/Inbox";
import ReplyMessage from "./pages/ReplyMessage";
import Conversation from "./pages/Conversation";



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
      { path: "items/:id/edit", element: <EditItem />, },   // "/items/4/edit"
      { path: "items/:id/contact", element: <ContactOwner />, }, 
      { path: "inbox", element: <Inbox />, },
      { path: "messages/:messageId/reply", element: <ReplyMessage />, },
      { path: "conversation/:itemId/:userId", element: <Conversation />, },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
