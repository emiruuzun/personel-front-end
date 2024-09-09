import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from './context/UserContext'; 

ReactDOM.render(
  <BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <UserProvider> 
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
